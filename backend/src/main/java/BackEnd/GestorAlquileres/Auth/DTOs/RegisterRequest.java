package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El usuario no es válido")
        @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
        String username,
        @NotBlank(message = "El email no puede ser vacío")
        String email,
        @NotBlank(message = "La contraseña no puede ser vacío")
        @Size(min = 6)
        String password,
        @NotBlank(message = "La contraseña no puede ser vacío")
        @Size(min = 6)
        String confirmPassword
) {}