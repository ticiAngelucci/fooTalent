package BackEnd.Rentary.Payments.DTOs;

import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;

import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;


@Data
@Builder
public class PaymentDetailedResponse {
    private Long id;
    private BigDecimal amount;
    private PaymentStatus status;
    private String tenantName;
    private String propertyAddress;
    private AdjustmentFrequency adjustmentFrequency;
    private int deadline;
}