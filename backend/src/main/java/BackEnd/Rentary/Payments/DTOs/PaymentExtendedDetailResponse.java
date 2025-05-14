package BackEnd.Rentary.Payments.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;

import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;

public record PaymentExtendedDetailResponse(
        Long id,
        String tenantName,
        String fullAddress,
        AdjustmentFrequency adjustmentFrequency,
        BigDecimal baseRentAmount,
        int deadlineDays,
        LocalDate dueDate,
        PaymentStatus status,
        ServiceType serviceType,
        BigDecimal amount,
        LocalDate paymentDate) {
}