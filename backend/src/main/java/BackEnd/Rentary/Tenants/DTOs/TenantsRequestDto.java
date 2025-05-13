package BackEnd.Rentary.Tenants.DTOs;

import BackEnd.Rentary.Common.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record TenantsRequestDto (
        @NotNull(message = "El nombre es requerido.")
        String firstName,

        @NotNull(message = "El apellido es requerido.")
        String lastName,

        @Email(message = "El email debe ser válido.")
        @NotNull(message = "El email es requerido.")
        String email,

        @NotNull(message = "El teléfono es requerido.")
        String phone,
        @NotNull(message = "La fecha de nacimiento es requerida.")
        String warranty,
        @NotNull(message = "El DNI es requerido.")
        String dni,

        @Valid
        @NotNull(message = "La dirección es requerida")
        Address address
) {}