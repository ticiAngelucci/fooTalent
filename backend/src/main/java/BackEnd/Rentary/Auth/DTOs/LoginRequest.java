package BackEnd.Rentary.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El campo email no puede estar vacío")
        String email,
        @NotBlank(message = "El campo contraseña no puede estar vacío")
        String password
) {}