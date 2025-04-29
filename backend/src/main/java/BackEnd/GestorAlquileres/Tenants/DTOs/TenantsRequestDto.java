package BackEnd.GestorAlquileres.Tenants.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record TenantsRequestDto(
        @NotNull(message = "El nombre es requerido")
        String firstName,
        @NotNull(message = "El apellido es requerido")
        String lastName,
        @Email(message = "El email debe ser válido")
        @NotNull(message = "El email es requerido")
        String email,
        @NotNull(message = "El telefono es requerido")
        String phone
) {
}
