package BackEnd.Rentary.Owners.DTOs;

import BackEnd.Rentary.Common.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record OwnerRequestDto(
        @NotNull(message = "Este campo es necesario.")
        String firstName,
        @NotNull(message = "Este campo es necesario.")
        String lastName,
        @NotBlank(message = "El DNI es obligatorio")
        @Pattern(regexp = "\\d{8}", message = "El DNI debe tener 8 dígitos numéricos")
        String dni,
        @Email(message = "El email debe ser válido.")
        @NotNull(message = "Este campo es necesario.")
        String email,
        @NotNull(message = "Este campo es necesario.")
        String phone,
        @Valid
        @NotNull(message = "Este campo es necesario.")
        Address address
) {}
