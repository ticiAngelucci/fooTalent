package BackEnd.Rentary.Payments.Service.Impl;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.ContractNorFoundException;
import BackEnd.Rentary.Exceptions.InvalidPaymentException;
import BackEnd.Rentary.Exceptions.PaymentNotFoundException;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.*;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl {
    private final PaymentRepository paymentRepository;
    private final IContractRepository contractRepository;

    @Transactional
    public Payment registerPayment(
            Long contractId,
            BigDecimal amount,
            LocalDate paymentDate,
            ServiceType serviceType,
            PaymentMethod paymentMethod,
            Currency currency,
            String description) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNorFoundException(contractId.toString()));

        if (!contract.isActive()) {
            throw new InvalidPaymentException("No se puede registrar un pago para un contrato inactivo");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("El monto del pago debe ser mayor que cero");
        }

        if (serviceType == ServiceType.ALQUILER) {
            BigDecimal pendingAmount = calculatePendingAmount(contractId);
            if (amount.compareTo(pendingAmount) > 0) {
                throw new InvalidPaymentException("El monto del pago no puede ser mayor que el saldo pendiente");
            }
        }

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        Payment payment = Payment.builder()
                .contract(contract)
                .amount(amount)
                .dueDate(calculateDueDate(contract))
                .paymentDate(paymentDate)
                .status(PaymentStatus.PAGADO)
                .serviceType(serviceType)
                .paymentMethod(paymentMethod)
                .currency(currency)
                .description(description)
                .period(currentMonth)
                .year(currentYear)
                .build();

        return paymentRepository.save(payment);
    }

    public Page<Payment> getPaymentsByContract(Long contractId, Pageable pageable) {
        // Verificar que el contrato existe
        if (!contractRepository.existsById(contractId)) {
            throw new ContractNorFoundException(contractId.toString());
        }

        return paymentRepository.findByContractContractId(contractId, pageable);
    }

    public Page<Payment> getPendingPayments(Pageable pageable) {
        return paymentRepository.findByStatus(PaymentStatus.PENDIENTE, pageable);
    }

    @Transactional
    public void updatePaymentStatus() {
        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDIENTE);

        LocalDate today = LocalDate.now();
        for (Payment payment : pendingPayments) {
            Contract contract = payment.getContract();
            LocalDate deadlineDate = payment.getDueDate().plusDays(contract.getDeadline());

            if (today.isAfter(deadlineDate)) {
                payment.setStatus(PaymentStatus.VENCIDO);
                paymentRepository.save(payment);
                log.info("Pago ID {} actualizado a estado VENCIDO", payment.getId());
            }
        }
    }

    public BigDecimal calculatePendingAmount(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNorFoundException(contractId.toString()));

        // Calcular cuántos meses han pasado desde el inicio del contrato
        LocalDate today = LocalDate.now();
        LocalDate startDate = contract.getStartDate();

        // Verificar si la fecha actual está dentro del período del contrato
        if (today.isBefore(startDate) || today.isAfter(contract.getEndDate())) {
            return BigDecimal.ZERO;
        }

        int monthsPassed = (today.getYear() - startDate.getYear()) * 12 +
                today.getMonthValue() - startDate.getMonthValue() + 1;

        // Calcular el total que debería haberse pagado hasta ahora
        BigDecimal totalDue = BigDecimal.valueOf(contract.getBaseRent()).multiply(BigDecimal.valueOf(monthsPassed));

        // Calcular el total ya pagado
        BigDecimal totalPaid = paymentRepository.sumAmountByContractAndServiceType(contractId, ServiceType.ALQUILER);
        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        // Retornar la diferencia (lo que falta pagar)
        return totalDue.subtract(totalPaid);
    }

    private LocalDate calculateDueDate(Contract contract) {
        LocalDate today = LocalDate.now();
        return LocalDate.of(today.getYear(), today.getMonth(), 10);
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId.toString()));
    }

    public Page<Payment> getPaymentsByServiceType(ServiceType serviceType, Pageable pageable) {
        return paymentRepository.findByServiceType(serviceType, pageable);
    }

    public Page<Payment> getNonRentalPayments(Pageable pageable) {
        return paymentRepository.findByServiceTypeNot(ServiceType.ALQUILER, pageable);
    }

    @Transactional
    public boolean cancelPayment(Long paymentId) {
        Payment payment = getPaymentById(paymentId);

        if (payment.getStatus() == PaymentStatus.PAGADO) {
            throw new InvalidPaymentException("No se puede cancelar un pago ya realizado");
        }

        paymentRepository.delete(payment);
        log.info("Pago ID {} cancelado", paymentId);
        return true;
    }
}