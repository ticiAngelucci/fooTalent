package BackEnd.Rentary.Auth.DTOs;

public record AuthResponse(
        String token,
        String message,
        boolean success
) {}