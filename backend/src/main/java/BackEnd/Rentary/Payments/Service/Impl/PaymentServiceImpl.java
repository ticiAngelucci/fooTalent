package BackEnd.Rentary.Payments.Service.Impl;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.ContractNorFoundException;
import BackEnd.Rentary.Exceptions.InvalidPaymentException;
import BackEnd.Rentary.Exceptions.PaymentNotFoundException;
import BackEnd.Rentary.Payments.DTOs.*;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.*;
import BackEnd.Rentary.Payments.Mapper.PaymentMapper;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import BackEnd.Rentary.Payments.Service.PaymentService;
import BackEnd.Rentary.Tenants.entities.Tenants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final IContractRepository contractRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public Payment registerPayment(
            Long contractId,
            BigDecimal amount,
            LocalDate paymentDate,
            ServiceType serviceType,
            PaymentMethod paymentMethod,
            Currency currency,
            String description) {

        Contract contract = findAndValidateContract(contractId);
        validatePaymentAmount(amount);

        if (serviceType == ServiceType.ALQUILER) {
            validateRentalPaymentAmount(contractId, amount);
        }

        Payment payment = createPaymentEntity(
                contract,
                amount,
                paymentDate,
                serviceType,
                paymentMethod,
                currency,
                description);

        log.info("Registrando pago de {} para contrato ID {} por un monto de {}",
                serviceType, contractId, amount);

        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponsePage getPaymentsByContract(Long contractId, int page, int size) {
        log.info("Obteniendo pagos para contrato ID: {} (página: {}, tamaño: {})", contractId, page, size);
        validateContractExists(contractId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractId(contractId, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponsePage getPendingPayments(int page, int size) {
        log.info("Obteniendo pagos pendientes (página: {}, tamaño: {})", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDIENTE, pageable);

        List<PaymentResponse> paymentResponses = pendingPayments.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                pendingPayments.getTotalElements());
    }

    @Override
    @Transactional
    public void updatePaymentStatus() {
        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDIENTE);
        LocalDate today = LocalDate.now();

        int updatedCount = 0;
        for (Payment payment : pendingPayments) {
            if (isPaymentOverdue(payment, today)) {
                payment.setStatus(PaymentStatus.VENCIDO);
                paymentRepository.save(payment);
                updatedCount++;
                log.info("Pago ID {} actualizado a estado VENCIDO", payment.getId());
            }
        }

        log.info("Proceso de actualización de pagos completado. {} pagos actualizados a VENCIDO", updatedCount);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaymentDetailedResponsePage getAllPaymentsDetailed(int page, int size) {
        log.info("Obteniendo todos los pagos con detalles completos (página: {}, tamaño: {})", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findAll(pageable);

        List<PaymentDetailedResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toDetailedResponse)
                .collect(Collectors.toList());

        return new PaymentDetailedResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    public BigDecimal calculatePendingAmount(Long contractId) {
        Contract contract = findAndValidateContract(contractId);

        LocalDate today = LocalDate.now();
        LocalDate startDate = contract.getStartDate();

        if (isContractOutOfDateRange(today, contract)) {
            return BigDecimal.ZERO;
        }

        int monthsPassed = calculateMonthsPassed(today, startDate);
        BigDecimal totalDue = calculateTotalDue(contract.getBaseRent(), monthsPassed);
        BigDecimal totalPaid = getTotalPaidForContract(contractId);

        return totalDue.subtract(totalPaid);
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        log.info("Buscando pago con ID: {}", paymentId);
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId.toString()));
    }

    @Override
    public PaymentResponsePage getPaymentsByServiceType(ServiceType serviceType, int page, int size) {
        log.info("Obteniendo pagos por tipo de servicio: {} (página: {}, tamaño: {})", serviceType, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceType(serviceType, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    public PaymentResponsePage getPaymentsSummaryByServiceType(ServiceType serviceType, int page, int size) {
        log.info("Obteniendo resumen de pagos por tipo de servicio: {} (página: {}, tamaño: {})", serviceType, page,
                size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceType(serviceType, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    public PaymentResponsePage getNonRentalPayments(int page, int size) {
        log.info("Obteniendo pagos no relacionados con alquiler (página: {}, tamaño: {})", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceTypeNot(ServiceType.ALQUILER, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    public PaymentResponsePage getNonRentalPaymentsSummary(int page, int size) {
        log.info("Obteniendo resumen de pagos no relacionados con alquiler (página: {}, tamaño: {})", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceTypeNot(ServiceType.ALQUILER, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
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

    /**
     * Busca y valida que un contrato exista y esté activo
     */
    private Contract findAndValidateContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNorFoundException(contractId.toString()));

        if (!contract.isActive()) {
            throw new InvalidPaymentException("No se puede registrar un pago para un contrato inactivo");
        }

        return contract;
    }

    private void validateContractExists(Long contractId) {
        if (!contractRepository.existsById(contractId)) {
            throw new ContractNorFoundException(contractId.toString());
        }
    }

    private void validatePaymentAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("El monto del pago debe ser mayor que cero");
        }
    }

    private void validateRentalPaymentAmount(Long contractId, BigDecimal amount) {
        BigDecimal pendingAmount = calculatePendingAmount(contractId);
        if (amount.compareTo(pendingAmount) > 0) {
            throw new InvalidPaymentException("El monto del pago no puede ser mayor que el saldo pendiente");
        }
    }

    private Payment createPaymentEntity(
            Contract contract,
            BigDecimal amount,
            LocalDate paymentDate,
            ServiceType serviceType,
            PaymentMethod paymentMethod,
            Currency currency,
            String description) {

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();
        LocalDate dueDate = calculateDueDate(contract);

        return Payment.builder()
                .contract(contract)
                .amount(amount)
                .dueDate(dueDate)
                .paymentDate(paymentDate)
                .status(PaymentStatus.PAGADO)
                .serviceType(serviceType)
                .paymentMethod(paymentMethod)
                .currency(currency)
                .description(description)
                .period(currentMonth)
                .year(currentYear)
                .build();
    }

    private LocalDate calculateDueDate(Contract contract) {
        LocalDate today = LocalDate.now();
        return LocalDate.of(today.getYear(), today.getMonth(), 10);
    }

    private boolean isPaymentOverdue(Payment payment, LocalDate today) {
        Contract contract = payment.getContract();
        LocalDate deadlineDate = payment.getDueDate().plusDays(contract.getDeadline());
        return today.isAfter(deadlineDate);
    }

    private boolean isContractOutOfDateRange(LocalDate today, Contract contract) {
        return today.isBefore(contract.getStartDate()) || today.isAfter(contract.getEndDate());
    }

    private int calculateMonthsPassed(LocalDate today, LocalDate startDate) {
        return (today.getYear() - startDate.getYear()) * 12 +
                today.getMonthValue() - startDate.getMonthValue() + 1;
    }

    private BigDecimal calculateTotalDue(double baseRent, int monthsPassed) {
        return BigDecimal.valueOf(baseRent).multiply(BigDecimal.valueOf(monthsPassed));
    }

    private BigDecimal getTotalPaidForContract(Long contractId) {
        BigDecimal totalPaid = paymentRepository.sumAmountByContractAndServiceType(
                contractId, ServiceType.ALQUILER);
        return totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }
}