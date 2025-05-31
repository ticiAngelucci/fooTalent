package BackEnd.Rentary.Payments.Service.Impl;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.InvalidPaymentException;
import BackEnd.Rentary.Exceptions.PaymentNotFoundException;
import BackEnd.Rentary.Payments.DTOs.*;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Payments.Factory.PaymentFactory;
import BackEnd.Rentary.Payments.Mapper.PaymentMapper;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import BackEnd.Rentary.Payments.Service.PaymentService;
import BackEnd.Rentary.Payments.Utils.PaymentCalculationUtil;
import BackEnd.Rentary.Payments.Utils.PaymentValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final IContractRepository contractRepository;
    private final PaymentMapper paymentMapper;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    @Transactional
    public Payment registerPayment(Long contractId, BigDecimal amount, LocalDate paymentDate,
                                   ServiceType serviceType, PaymentMethod paymentMethod,
                                   Currency currency, String description) {

        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        Payment payment = PaymentFactory.createPaymentEntity(
                contract, amount, paymentDate, serviceType,
                paymentMethod, currency, description, currentUser
        );

        return paymentRepository.save(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePaymentResponsePage getServicePaymentsByContractAndType(Long contractId, ServiceType serviceType, int page, int size) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceTypeAndCreatedBy(
                contractId, serviceType, currentUser, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePaymentResponsePage getAllServicePaymentsByContract(Long contractId, int page, int size) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceTypeNotAndCreatedBy(
                contractId, ServiceType.ALQUILER, currentUser, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentRentalResponsePage getRentalPaymentsByContract(Long contractId, int page, int size) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndServiceTypeAndCreatedBy(
                contractId, ServiceType.ALQUILER, currentUser, pageable);

        List<PaymentRentalResponseDto> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toRentalResponse)
                .collect(Collectors.toList());

        return new PaymentRentalResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponsePage getPaymentsByContract(Long contractId, int page, int size) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByContractContractIdAndCreatedBy(
                contractId, currentUser, pageable);

        List<PaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponsePage getPendingPayments(int page, int size) {
        String currentUser = getCurrentUserEmail();
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> pendingPayments = paymentRepository.findByStatusAndCreatedBy(PaymentStatus.PENDIENTE, currentUser, pageable);

        List<PaymentResponse> paymentResponses = pendingPayments.getContent().stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());

        return new PaymentResponsePage(paymentResponses, page, pendingPayments.getTotalElements());
    }

    @Override
    @Transactional
    public void updatePaymentStatus() {
        String currentUser = getCurrentUserEmail();
        List<Payment> pendingPayments = paymentRepository.findByStatusAndCreatedBy(PaymentStatus.PENDIENTE, currentUser);
        LocalDate today = LocalDate.now();

        for (Payment payment : pendingPayments) {
            if (PaymentCalculationUtil.isPaymentOverdue(payment, today)) {
                payment.setStatus(PaymentStatus.VENCIDO);
                paymentRepository.save(payment);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDetailedResponsePage getAllPaymentsDetailed(int page, int size) {
        String currentUser = getCurrentUserEmail();
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByCreatedBy(currentUser, pageable);

        List<PaymentDetailedResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toDetailedResponse)
                .collect(Collectors.toList());

        return new PaymentDetailedResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }


    @Transactional(readOnly = true)
    public PaymentDetailedResponsePage getAllPaymentsRent(int page, int size) {
        String currentUser = getCurrentUserEmail();
        Pageable pageable = PageRequest.of(page, size);

        Page<Payment> paymentsPage = paymentRepository.findByCreatedByAndServiceType(
                currentUser, ServiceType.ALQUILER, pageable);

        List<PaymentDetailedResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toDetailedResponse)
                .collect(Collectors.toList());

        return new PaymentDetailedResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePaymentResponsePage getServicePaymentsByType(ServiceType serviceType, int page, int size) {
        String currentUser = getCurrentUserEmail();
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> paymentsPage = paymentRepository.findByServiceTypeAndCreatedBy(serviceType, currentUser, pageable);

        List<ServicePaymentResponse> paymentResponses = paymentsPage.getContent().stream()
                .map(paymentMapper::toServiceResponse)
                .collect(Collectors.toList());

        return new ServicePaymentResponsePage(paymentResponses, page, paymentsPage.getTotalElements());
    }

    @Override
    public BigDecimal calculatePendingAmount(Long contractId) {
        Contract contract = PaymentValidationUtil.findAndValidateContract(contractRepository, contractId);
        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(contract, currentUser);

        LocalDate today = LocalDate.now();
        LocalDate startDate = contract.getStartDate();

        if (PaymentCalculationUtil.isContractOutOfDateRange(today, contract)) {
            return BigDecimal.ZERO;
        }

        int monthsPassed = PaymentCalculationUtil.calculateMonthsPassed(today, startDate);
        BigDecimal totalDue = PaymentCalculationUtil.calculateTotalDue(contract.getBaseRent(), monthsPassed);
        BigDecimal totalPaid = getTotalPaidForContract(contractId, currentUser);

        return totalDue.subtract(totalPaid);
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId.toString()));

        String currentUser = getCurrentUserEmail();
        validateContractBelongsToUser(payment.getContract(), currentUser);

        return payment;
    }

    @Override
    @Transactional
    public boolean cancelPayment(Long paymentId) {
        Payment payment = getPaymentById(paymentId);

        if (payment.getStatus() == PaymentStatus.PAGADO) {
            throw new InvalidPaymentException("No se puede cancelar un pago ya realizado");
        }

        paymentRepository.delete(payment);
        return true;
    }

    @Override
    @Transactional
    public Payment confirmRentalPayment(Long paymentId, BigDecimal amount, LocalDate paymentDate,
                                        PaymentMethod paymentMethod, Currency currency, String description)
            throws ChangeSetPersister.NotFoundException {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(ChangeSetPersister.NotFoundException::new);

        if (payment.getStatus() != PaymentStatus.PENDIENTE) {
            throw new InvalidPaymentException("El pago ya fue confirmado o no está pendiente");
        }

        PaymentValidationUtil.validatePaymentAmount(amount);

        validateRentalPaymentAmountRental(payment.getContract(), amount);

        payment.setAmount(amount);
        payment.setPaymentDate(paymentDate);
        payment.setPaymentMethod(paymentMethod);
        payment.setCurrency(currency);
        payment.setDescription(description);
        payment.setStatus(PaymentStatus.PAGADO);

        return paymentRepository.save(payment);
    }
    
    private BigDecimal getTotalPaidForContract(Long contractId, String currentUser) {
        BigDecimal totalPaid = paymentRepository.sumAmountByContractAndServiceTypeAndCreatedBy(
                contractId, ServiceType.ALQUILER, currentUser);
        return totalPaid != null ? totalPaid : BigDecimal.ZERO;
    }

    private void validateRentalPaymentAmountRental(Contract contract, BigDecimal amount) {
        amount = amount.setScale(2, RoundingMode.HALF_UP);
        BigDecimal pendingAmount = BigDecimal
                .valueOf(contract.getBaseRent())
                .setScale(2, RoundingMode.HALF_UP);

        if (amount.compareTo(pendingAmount) > 0) {
            throw new InvalidPaymentException("El monto del pago no puede ser mayor que el saldo pendiente");
        }
    }

    private void validateContractBelongsToUser(Contract contract, String currentUser) {
        if (!contract.getCreatedBy().equals(currentUser)) {
            throw new InvalidPaymentException("No tienes permisos para acceder a este contrato");
        }
    }
}
