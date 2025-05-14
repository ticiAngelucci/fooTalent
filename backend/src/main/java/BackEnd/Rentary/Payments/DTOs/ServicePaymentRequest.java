package BackEnd.Rentary.Payments.DTOs;

import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ServicePaymentRequest(
        @NotNull(message = "El ID del contrato es obligatorio")
        Long contractId,
        @NotNull(message = "El monto es obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor que 0 ")
        BigDecimal amount,
        @NotNull(message = "La fecha de pago es obligatoria")
        LocalDate paymentDate,
        @NotNull(message = "El tipo de servicio es obligatorio")
        ServiceType serviceType,
        @NotNull(message = "El método de pago es obligatorio")
        PaymentMethod paymentMethod,
        @NotNull(message = "La moneda es obligatoria")
        Currency currency,
        String description
) {
}
