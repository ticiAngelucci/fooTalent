package BackEnd.GestorAlquileres.Auth.DTOs;

public record LoginRequest(
        String username,
        String password
) {}