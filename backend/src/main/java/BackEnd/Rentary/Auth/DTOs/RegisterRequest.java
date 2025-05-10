package BackEnd.Rentary.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El apellido no puede ser vacío")
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        String lastName,

        @NotBlank(message = "El nombre no puede ser vacío")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String firstName,

        @NotBlank(message = "El email no puede ser vacío")
        String email,

        @NotBlank(message = "La contraseña no puede ser vacío")
        @Size(min = 8, max = 16)
        String password,

        @NotBlank(message = "La contraseña no puede ser vacío")
        @Size(min = 8, max = 16)
        String confirmPassword
) {}
