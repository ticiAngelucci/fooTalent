package BackEnd.GestorAlquileres.Auth.Controller;

import BackEnd.GestorAlquileres.Auth.DTOs.AuthResponse;
import BackEnd.GestorAlquileres.Auth.DTOs.ChangePasswordRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.LoginRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.RegisterRequest;
import BackEnd.GestorAlquileres.Auth.Services.AuthService;
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
        AuthResponse response = authService.changePassword(request);

        if (!response.success()) {
            return switch (response.message()) {
                case "Usuario no encontrado." ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                case "Contraseña actual incorrecta." ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                default ->
                        ResponseEntity.badRequest().body(response);
            };
        }

        return ResponseEntity.ok(response);
    }
}