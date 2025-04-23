package BackEnd.GestorAlquileres.Auth.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        String username,
        @NotBlank
        String email,
        @NotBlank
        @Size(min = 6)
        String password
) {}