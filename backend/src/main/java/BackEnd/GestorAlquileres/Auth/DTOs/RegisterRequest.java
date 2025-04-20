package BackEnd.GestorAlquileres.Auth.DTOs;

public record RegisterRequest(
        String username,
        String email,
        String password
) {}