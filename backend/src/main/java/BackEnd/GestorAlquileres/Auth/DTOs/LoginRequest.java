package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El email no puede ser vacío")
        String email,
        @NotBlank(message = "La contraseña no puede ser vacío")
        String password
) {}