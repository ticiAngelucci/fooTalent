package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank
        String email,
        @NotBlank
        String oldPassword,
        @NotBlank
        String newPassword
) {}