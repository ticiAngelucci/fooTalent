package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;

public record CambioContraseñaRequest(
        @NotBlank
        String userName,
        @NotBlank
        String oldPassword,
        @NotBlank
        String newPassword
) {
}
