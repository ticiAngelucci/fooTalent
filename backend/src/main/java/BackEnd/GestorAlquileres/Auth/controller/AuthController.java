package BackEnd.GestorAlquileres.Auth.controller;

import BackEnd.GestorAlquileres.Auth.DTOs.AuthResponse;
import BackEnd.GestorAlquileres.Auth.DTOs.CambioContraseñaRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.LoginRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.RegisterRequest;
import BackEnd.GestorAlquileres.Auth.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/cambio_contrasena")
    public ResponseEntity<AuthResponse> cambioContraseña(
            @Valid @RequestBody CambioContraseñaRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(authService.cambioContraseña(request));
    }

}