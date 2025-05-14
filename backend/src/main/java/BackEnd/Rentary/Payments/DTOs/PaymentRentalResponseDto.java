package BackEnd.Rentary.Payments.DTOs;

import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@Builder
public class PaymentRentalResponseDto {
    private Long id;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentStatus status;
}
