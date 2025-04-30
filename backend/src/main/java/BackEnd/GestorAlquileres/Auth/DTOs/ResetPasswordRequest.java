package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank String token,
        @NotBlank String newPassword,
        @NotBlank String confirmPassword
) {}