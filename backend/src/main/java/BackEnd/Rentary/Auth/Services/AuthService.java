package BackEnd.Rentary.Auth.Services;

import BackEnd.Rentary.Auth.DTOs.*;
import BackEnd.Rentary.Auth.Enums.Role;
import BackEnd.Rentary.Auth.Util.VerificationToken;
import BackEnd.Rentary.Auth.Util.VerificationTokenRepository;
import BackEnd.Rentary.Users.Repositories.UserRepository;
import BackEnd.Rentary.Auth.Util.UserValidation;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import BackEnd.Rentary.Users.Entities.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserValidation userValidation;
    private final EmailService emailService;
    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${base-url}")
    private String baseUrl;
    @Value("${URL_FRONT}")
    private String frontUrl;
    @Value("${URL_BACK}")
    private String backUrl;

    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            return new AuthResponse(null, "Las contraseñas no coinciden.", false);
        }

        String fullName = request.firstName() + " " + request.lastName();

        User tempUser = new User();
        tempUser.setUsername(fullName);
        tempUser.setEmail(request.email());
        tempUser.setPassword(request.password());

        AuthResponse validationResponse = userValidation.validate(tempUser);
        if (!validationResponse.success()) {
            return validationResponse;
        }

        if (userRepository.findByEmail(request.email()).isPresent()) {
            return new AuthResponse(null, "El email ya está registrado", false);
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(fullName);
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiration(new Date(System.currentTimeMillis() + 86400000)); // Expira en 1 día
        user.setIsActive(false);

        userRepository.save(user);

        String link = backUrl + "/auth/verifyToken?token=" + verificationToken;
        emailService.sendEmail(user.getEmail(), "Verifica tu cuenta",
                "<p>Hola " + user.getUsername() + ",</p>" +
                        "<p>Gracias por registrarte en Rentary. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>" +
                        "<a href=\"" + link + "\">Verificar cuenta</a>"
        );

        System.out.println("Token de verificación enviado: " + verificationToken);
        return new AuthResponse(null, "Usuario registrado exitosamente. Por favor verifica tu correo.", true);
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.email());
        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (Exception e) {
            return new AuthResponse(null, "Contraseña incorrecta.", false);
        }

        User user = optionalUser.get();
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Usuario autenticado exitosamente.", true);
    }
    
    public AuthResponse changePassword(ChangePasswordRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.email());

        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }
        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return new AuthResponse(null, "Contraseña actual incorrecta.", false);
        }

        AuthResponse passwordValidation = userValidation.validatePassword(request.newPassword());
        if (!passwordValidation.success()) {
            return passwordValidation;
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            return new AuthResponse(null, "La nueva contraseña no puede ser igual a la anterior.", false);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Contraseña actualizada con éxito.", true);
    }
    @Transactional
    public String forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("No existe una cuenta con ese email.");
        }

        User user = optionalUser.get();

        verificationTokenRepository.deleteByUser(user);

        String token = generateUniqueToken();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        verificationTokenRepository.save(verificationToken);

        String link = frontUrl + "/reset_password?token=" + token;
        emailService.sendEmail(user.getEmail(), "Recuperar contraseña",
                "<p>Hola " + user.getUsername() + ",</p>" +
                        "<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>" +
                        "<a href=\"" + link + "\">Restablecer contraseña</a><br>" +
                        "<p>Este enlace expirará en 1 hora.</p>");

        return "Se ha enviado un correo para restablecer la contraseña.";
    }

    private String generateUniqueToken() {
        String token;
        do {
            token = UUID.randomUUID().toString();
        } while (verificationTokenRepository.findByToken(token).isPresent());
        return token;
    }

    public AuthResponse resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            return new AuthResponse(null, "Las contraseñas no coinciden.", false);
        }

        Optional<VerificationToken> optionalToken = verificationTokenRepository.findByToken(request.token());

        if (optionalToken.isEmpty()) {
            return new AuthResponse(null, "Token inválido.", false);
        }

        VerificationToken token = optionalToken.get();

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return new AuthResponse(null, "El token ha expirado.", false);
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
        verificationTokenRepository.delete(token);

        return new AuthResponse(null, "Contraseña actualizada exitosamente.", true);
    }
}