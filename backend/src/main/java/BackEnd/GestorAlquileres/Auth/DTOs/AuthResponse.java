package BackEnd.GestorAlquileres.Auth.DTOs;

public record AuthResponse(
        String token,
        String message,
        boolean success
) {}