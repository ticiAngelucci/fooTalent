package BackEnd.Rentary.Auth.Controller;

import BackEnd.Rentary.Auth.DTOs.*;
import BackEnd.Rentary.Auth.Services.AuthService;
import BackEnd.Rentary.Auth.Util.VerificationTokenRepository;
import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;
    @Value("${URL_FRONT}")
    private String frontUrl;

    @Operation(
            summary = "Registrar un nuevo usuario",
            description = "Registra un nuevo usuario que administra sus contratos, inquilinos, propiedades y pagos")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Nombre completo recibido: '" + request.firstName() + " " + request.lastName() + "'");
        AuthResponse response = authService.register(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Ingreso de usuario en la página de inicio")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (!response.success()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Realizar el cambio de contraseña de un usuario")
    @PutMapping("/change_password")
    public ResponseEntity<AuthResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        AuthResponse response = authService.changePassword(request);

        if (!response.success()) {
            return switch (response.message()) {
                case "Usuario no encontrado." -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                case "Contraseña actual incorrecta." -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                default -> ResponseEntity.badRequest().body(response);
            };
        }

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Verificación de token")
    @GetMapping("/verifyToken")
    public void verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        // Validar que el token no sea nulo o vacío
        if (token == null || token.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        // Buscar al usuario por el token
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            response.sendRedirect(frontUrl + "/login?verified=invalid");
            return;
        }

        User user = optionalUser.get();

        // Verificar si el token ha expirado
        if (user.getVerificationTokenExpiration() == null || user.getVerificationTokenExpiration().before(new Date())) {
            response.sendRedirect(frontUrl + "/login?verified=expired");
            return;
        }

        // Verificar si el usuario ya está activo
        if (user.getIsActive()) {
            response.sendRedirect(frontUrl + "/login?verified=already");
            return;
        }

        // Activar el usuario
        user.setIsActive(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiration(null);
        userRepository.save(user);

        // Redirigir al login con mensaje de éxito
        response.sendRedirect(frontUrl + "/login?verified=success");
    }

    @PostMapping("/forgot_password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String response = authService.forgotPassword(request.email());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Restaurar contraseña de un usuario")
    @PutMapping("/reset_password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);

        if (!response.success()) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

}