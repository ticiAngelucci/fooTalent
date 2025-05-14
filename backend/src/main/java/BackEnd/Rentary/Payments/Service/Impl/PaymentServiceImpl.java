package BackEnd.Rentary.Payments.Service.Impl;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.InvalidPaymentException;
import BackEnd.Rentary.Exceptions.PaymentNotFoundException;
import BackEnd.Rentary.Payments.DTOs.*;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.*;
import BackEnd.Rentary.Payments.Factory.PaymentFactory;
import BackEnd.Rentary.Payments.Mapper.PaymentMapper;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import BackEnd.Rentary.Payments.Service.PaymentService;
import BackEnd.Rentary.Payments.Utils.PaymentCalculationUtil;
import BackEnd.Rentary.Payments.Utils.PaymentValidationUtil;
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

        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        PaymentValidationUtil.validatePaymentAmount(amount);

        if (serviceType == ServiceType.ALQUILER) {
            validateRentalPaymentAmount(contractId, amount);
        }

        Payment payment = PaymentFactory.createPaymentEntity(
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
    public ServicePaymentResponsePage getServicePaymentsByContractAndType(
            Long contractId, ServiceType serviceType, int page, int size) {

        log.info("Obteniendo pagos de servicios tipo {} para contrato ID: {} (página: {}, tamaño: {})",
                serviceType, contractId, page, size);

        PaymentValidationUtil.validateContractExists(contractRepository, contractId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceType(
                contractId, serviceType, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePaymentResponsePage getAllServicePaymentsByContract(Long contractId, int page, int size) {
        log.info("Obteniendo todos los pagos de servicios (no alquiler) para contrato ID: {} (página: {}, tamaño: {})",
                contractId, page, size);

        PaymentValidationUtil.validateContractExists(contractRepository, contractId);

        Pageable pageable = PageRequest.of(page, size);

        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceTypeNot(
                contractId, ServiceType.ALQUILER, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentRentalResponsePage getRentalPaymentsByContract(Long contractId, int page, int size) {
        log.info("Obteniendo pagos de alquiler para contrato ID: {} (página: {}, tamaño: {})",
                contractId, page, size);

        PaymentValidationUtil.validateContractExists(contractRepository, contractId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceType(
                contractId, ServiceType.ALQUILER, pageable);

        List<PaymentRentalResponseDto> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toRentalResponse)
                .collect(Collectors.toList());

        return new PaymentRentalResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponsePage getPaymentsByContract(Long contractId, int page, int size) {
        log.info("Obteniendo pagos para contrato ID: {} (página: {}, tamaño: {})", contractId, page, size);
        PaymentValidationUtil.validateContractExists(contractRepository, contractId);

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
            if (PaymentCalculationUtil.isPaymentOverdue(payment, today)) {
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
    @Transactional(readOnly = true)
    public ServicePaymentResponsePage getServicePaymentsByType(ServiceType serviceType, int page, int size) {
        log.info("Obteniendo pagos de servicios por tipo: {} (página: {}, tamaño: {})",
                serviceType, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceType(serviceType, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(
                paymentResponses,
                page,
                paymentsPage.getTotalElements());
    }

    @Override
    public BigDecimal calculatePendingAmount(Long contractId) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);

        LocalDate today = LocalDate.now();
        LocalDate startDate = contract.getStartDate();

        if (PaymentCalculationUtil.isContractOutOfDateRange(today, contract)) {
            return BigDecimal.ZERO;
        }

        int monthsPassed = PaymentCalculationUtil.calculateMonthsPassed(today, startDate);
        BigDecimal totalDue = PaymentCalculationUtil.calculateTotalDue(contract.getBaseRent(), monthsPassed);
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

    private BigDecimal getTotalPaidForContract(Long contractId) {
        BigDecimal totalPaid = paymentRepository.sumAmountByContractAndServiceType(
                contractId, ServiceType.ALQUILER);
        return totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }

    private void validateRentalPaymentAmount(Long contractId, BigDecimal amount) {
        BigDecimal pendingAmount = calculatePendingAmount(contractId);
        if (amount.compareTo(pendingAmount) > 0) {
            throw new InvalidPaymentException("El monto del pago no puede ser mayor que el saldo pendiente");
        }
    }
}