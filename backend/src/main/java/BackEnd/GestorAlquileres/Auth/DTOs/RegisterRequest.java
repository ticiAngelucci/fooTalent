package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El usuario no puede ser vacío")
        String username,
        @NotBlank(message = "El email no puede ser vacío")
        String email,
        @NotBlank(message = "La contraseña no puede ser vacío")
        @Size(min = 6)
        String password
) {}