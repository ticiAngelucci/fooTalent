package BackEnd.Rentary.Payments.Factory;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Payments.Utils.PaymentCalculationUtil;
import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentFactory {

    public static Payment createPaymentEntity(
            Contract contract,
            BigDecimal amount,
            LocalDate paymentDate,
            ServiceType serviceType,
            PaymentMethod paymentMethod,
            Currency currency,
            String description,
            String createdBy) {

        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();
        LocalDate dueDate = PaymentCalculationUtil.calculateDueDate(contract);

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
                .createdBy(createdBy)
                .build();
    }
}