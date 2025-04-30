package BackEnd.GestorAlquileres.Auth.Services;

import BackEnd.GestorAlquileres.Auth.DTOs.*;
import BackEnd.GestorAlquileres.Auth.Enums.Role;
import BackEnd.GestorAlquileres.Auth.Util.VerificationToken;
import BackEnd.GestorAlquileres.Auth.Util.VerificationTokenRepository;
import BackEnd.GestorAlquileres.Users.Repositories.UserRepository;
import BackEnd.GestorAlquileres.Auth.Util.UserValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import BackEnd.GestorAlquileres.Users.Entities.User;
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

    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            return new AuthResponse(null, "Las contraseñas no coinciden.", false);
        }

        String fullName = request.firstName() + " " + request.lastName();

        User tempUser = new User();
        tempUser.setUsername(fullName);
        tempUser.setEmail(request.email());
        tempUser.setPassword(request.password());

        // Validamos email y password
        AuthResponse validationResponse = userValidation.validate(tempUser);
        if (!validationResponse.success()) {
            return validationResponse;
        }

        // Verificamos si el email ya existe
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return new AuthResponse(null, "El email ya está registrado", false);
        }

        // Crear el usuario
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(fullName);
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        // Crear token de verificación
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiration(new Date(System.currentTimeMillis() + 86400000)); // Expira en 1 día
        user.setIsActive(false);

        // Guardar en base de datos
        userRepository.save(user);

        // Enviar email de verificación
        String link = baseUrl + "/api/auth/verify?token=" + verificationToken;
        emailService.sendEmail(user.getEmail(), "Verifica tu cuenta",
                "<p>Hola " + user.getUsername() + ",</p>" +
                        "<p>Gracias por registrarte en Rentary. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>" +
                        "<a href=\"" + link + "\">Verificar cuenta</a>"
        );

        System.out.println("Token de verificación enviado: " + verificationToken);
        return new AuthResponse(null, "Usuario registrado exitosamente. Por favor verifica tu correo.", true);
    }

    public AuthResponse login(LoginRequest request) {
        // Verificar si el usuario existe antes de autenticar
        Optional<User> optionalUser = userRepository.findByEmail(request.email());
        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }
        try {
            // Autenticamos con Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (Exception e) {
            // Contraseña incorrecta o autenticación fallida
            return new AuthResponse(null, "Contraseña incorrecta.", false);
        }

        // Si todo esta bien, generamos el JWT y lo devolvemos
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

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return new AuthResponse(null, "Contraseña actual incorrecta.", false);
        }

       // Validar formato de la nueva contraseña
        AuthResponse passwordValidation = userValidation.validatePassword(request.newPassword());
        if (!passwordValidation.success()) {
            return passwordValidation;
        }

        // Evitar que la nueva contraseña sea igual a la anterior
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            return new AuthResponse(null, "La nueva contraseña no puede ser igual a la anterior.", false);
        }

        // Actualizar la contraseña
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Generar nuevo JWT
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Contraseña actualizada con éxito.", true);
    }
    public String forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("No existe una cuenta con ese email.");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        verificationTokenRepository.save(verificationToken);

        String link = baseUrl + "/api/auth/reset_password?token=" + token;
        emailService.sendEmail(user.getEmail(), "Recuperar contraseña",
                "<p>Hola " + user.getUsername() + ",</p>" +
                        "<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>" +
                        "<a href=\"" + link + "\">Restablecer contraseña</a><br>" +
                        "<p>Este enlace expirará en 1 hora.</p>");

        return "Se ha enviado un correo para restablecer la contraseña.";
    }
    //metodo para probar si todo funciona, hay que ver si queda o no
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

        // Guardar el nuevo password y eliminar el token
        userRepository.save(user);
        verificationTokenRepository.delete(token);

        return new AuthResponse(null, "Contraseña actualizada exitosamente.", true);
    }
}