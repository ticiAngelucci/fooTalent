package BackEnd.Rentary.Payments.DTOs;

import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ServicePaymentResponse {
    private Long id;
    private ServiceType serviceType;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentStatus status;
}
