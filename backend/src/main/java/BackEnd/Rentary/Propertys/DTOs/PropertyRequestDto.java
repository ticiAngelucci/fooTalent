package BackEnd.Rentary.Propertys.DTOs;

import jakarta.validation.constraints.NotNull;

public record PropertyRequestDto(
        @NotNull(message = "El ")
        String title
) {}