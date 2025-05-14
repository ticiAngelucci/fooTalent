package BackEnd.Rentary.Payments.DTOs;

import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import org.springframework.cglib.core.Local;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentSummaryResponse(
        Long id,
        BigDecimal amount,
        LocalDate dueDate,
        LocalDate paymentDate,
        PaymentStatus status,
        ContractSummary contract
) {
}
