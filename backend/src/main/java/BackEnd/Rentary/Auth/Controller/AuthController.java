package BackEnd.Rentary.Auth.Controller;

import BackEnd.Rentary.Auth.DTOs.*;
import BackEnd.Rentary.Auth.Services.AuthService;
import BackEnd.Rentary.Auth.Util.VerificationTokenRepository;
import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Nombre completo recibido: '" + request.firstName() + " " + request.lastName() + "'");
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
                case "Usuario no encontrado." -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                case "Contraseña actual incorrecta." -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                default -> ResponseEntity.badRequest().body(response);
            };
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verifyToken")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("El enlace de verificación no es válido o ya fue utilizado.");
        }

        User user = optionalUser.get();

        if (user.getVerificationTokenExpiration() == null || user.getVerificationTokenExpiration().before(new Date())) {
            return ResponseEntity.badRequest().body("El enlace de verificación ha expirado. Solicita uno nuevo.");
        }

        if (user.getIsActive()) {
            return ResponseEntity.badRequest().body("La cuenta ya está verificada.");
        }

        user.setIsActive(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiration(null);
        userRepository.save(user);

        return ResponseEntity.ok("¡Tu cuenta fue verificada exitosamente! Ahora puedes iniciar sesión.");
    }

    @PostMapping("/forgot_password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String response = authService.forgotPassword(request.email());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/reset_password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        AuthResponse response = authService.resetPassword(request);

        if (!response.success()) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

}