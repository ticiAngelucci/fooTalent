package BackEnd.GestorAlquileres.Auth.controller;

import BackEnd.GestorAlquileres.Auth.DTOs.AuthResponse;
import BackEnd.GestorAlquileres.Auth.DTOs.ChangePasswordRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.LoginRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.RegisterRequest;
import BackEnd.GestorAlquileres.Auth.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Username recibido: '" + request.username() + "'");
        AuthResponse response = authService.register(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/change_password")
    public ResponseEntity<AuthResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(authService.changePassword(request));
    }

}