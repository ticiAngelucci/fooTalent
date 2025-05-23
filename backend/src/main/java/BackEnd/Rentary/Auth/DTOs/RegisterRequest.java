package BackEnd.Rentary.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "El campo apellido no puede estar vacío")
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        String lastName,

        @NotBlank(message = "El campo nombre no puede estar vacío")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        String firstName,

        @NotBlank(message = "El campo email no puede estar vacío")
        String email,

        @NotBlank(message = "el campo contraseña no puede estar vacío")
        @Size(min = 8, max = 16)
        String password,

        @NotBlank(message = "el campo contraseña no puede estar vacío")
        @Size(min = 8, max = 16)
        String confirmPassword
) {}
