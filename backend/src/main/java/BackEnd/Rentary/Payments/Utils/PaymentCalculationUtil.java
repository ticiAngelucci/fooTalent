package BackEnd.Rentary.Payments.Utils;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Payments.Entities.Payment;


import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentCalculationUtil {


    public static LocalDate calculateDueDate(Contract contract) {
        LocalDate today = LocalDate.now();
        return LocalDate.of(today.getYear(), today.getMonth(), 10);
    }

    public static boolean isPaymentOverdue(Payment payment, LocalDate today) {
        Contract contract = payment.getContract();
        LocalDate deadlineDate = payment.getDueDate().plusDays(contract.getDeadline());
        return today.isAfter(deadlineDate);
    }

    public static boolean isContractOutOfDateRange(LocalDate today, Contract contract) {
        return today.isBefore(contract.getStartDate()) || today.isAfter(contract.getEndDate());
    }


    public static int calculateMonthsPassed(LocalDate today, LocalDate startDate) {
        return (today.getYear() - startDate.getYear()) * 12 +
                today.getMonthValue() - startDate.getMonthValue() + 1;
    }


    public static BigDecimal calculateTotalDue(double baseRent, int monthsPassed) {
        return BigDecimal.valueOf(baseRent).multiply(BigDecimal.valueOf(monthsPassed));
    }
}