package BackEnd.Rentary.Payments.Service;

import BackEnd.Rentary.Payments.DTOs.PaymentDetailedResponsePage;
import BackEnd.Rentary.Payments.DTOs.PaymentRentalResponsePage;
import BackEnd.Rentary.Payments.DTOs.PaymentResponsePage;
import BackEnd.Rentary.Payments.DTOs.ServicePaymentResponsePage;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface PaymentService {

    Payment registerPayment(Long contractId, BigDecimal amount,
            LocalDate paymentDate, ServiceType serviceType, PaymentMethod paymentMethod,
            Currency currency, String description);
    PaymentResponsePage getPaymentsByContract(Long contractId, int page, int size);
    PaymentResponsePage getPendingPayments(int page, int size);
    void updatePaymentStatus();
    BigDecimal calculatePendingAmount(Long contractId);
    Payment getPaymentById(Long paymentId);
    PaymentDetailedResponsePage getAllPaymentsDetailed(int page, int size);
    boolean cancelPayment(Long paymentId);
    ServicePaymentResponsePage getServicePaymentsByType(ServiceType serviceType, int page, int size);
    PaymentRentalResponsePage getRentalPaymentsByContract(Long contractId, int page, int size);
    ServicePaymentResponsePage getServicePaymentsByContractAndType(Long contractId, ServiceType serviceType, int page, int size);
    ServicePaymentResponsePage getAllServicePaymentsByContract(Long contractId, int page, int size);
    Payment confirmRentalPayment(Long paymentId, BigDecimal amount, LocalDate paymentDate,
                                 PaymentMethod paymentMethod, Currency currency, String description) throws ChangeSetPersister.NotFoundException;

}