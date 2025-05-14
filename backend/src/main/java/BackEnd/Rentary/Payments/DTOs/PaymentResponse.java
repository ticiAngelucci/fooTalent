package BackEnd.Rentary.Payments.DTOs;


import BackEnd.Rentary.Payments.Enums.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long contractId;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private Currency currency;
    private String description;
    private ServiceType serviceType;
    private int period;
    private int year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isOverdue;

    // Detalles básicos del contrato
    private String propertyAddress;
    private String tenantName;
}