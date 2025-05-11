package BackEnd.Rentary.Contracts.DTOs;

import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;
import BackEnd.Rentary.Contracts.Validation.ValidContractDates;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

@ValidContractDates
public record ContractRequest(
        @NotNull(message = "El ID de la propiedad es obligatorio.")
        Long propertyId,
        @NotNull(message = "El ID del inquilino es obligatorio.")
        Long tenantId,
        @NotNull(message = "La fecha de inicio es obligatoria.")
        LocalDate startDate,
        @NotNull(message = "La fecha de finalización es obligatoria.")
        LocalDate endDate,
        @NotNull(message = "El valor de la renta es obligatorio.")
        @PositiveOrZero(message = "La renta base no puede ser negativa.")
        double baseRent,
        @PositiveOrZero(message = "La renta base no puede ser negativa.")
        double deposit,
        @NotNull(message = "La frecuencia de ajuste es obligatoria.")
        AdjustmentFrequency adjustmentFrequency,
        @NotNull(message = "Campo requerido.")
        @Min(value = 1, message = "El plazo debe ser al menos de 1 día.")
        int deadline,
        @NotNull(message = "Campo requerido.")
        double adjustmentPercentage
) {}
