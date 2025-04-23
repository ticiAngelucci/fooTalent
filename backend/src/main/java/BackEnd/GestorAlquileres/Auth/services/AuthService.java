package BackEnd.GestorAlquileres.Auth.services;

import BackEnd.GestorAlquileres.Auth.DTOs.*;
import BackEnd.GestorAlquileres.Auth.enums.Role;
import BackEnd.GestorAlquileres.Auth.repositories.UserRepository;
import BackEnd.GestorAlquileres.Auth.util.UserValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import BackEnd.GestorAlquileres.Users.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserValidation userValidation;

    public AuthResponse register(RegisterRequest request) {

        if (!request.password().equals(request.confirmPassword())) {
            return new AuthResponse(null, "Las contraseñas no coinciden.", false);
        }

        User tempUser = new User();
        tempUser.setUsername(request.username());
        tempUser.setEmail(request.email());
        tempUser.setPassword(request.password());

        //Validamos email y password con UserValidation
        AuthResponse validationResponse = userValidation.validate(tempUser);
        if (!validationResponse.success()) {
            return validationResponse;
        }

        // Verificamos si el username ya existe
        if (userRepository.existsByUsername(request.username())) {
            return new AuthResponse(null, "El usuario ya existe.", false);
        }

        // Creamos el usuario nuevo
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password())); // Hash del password
        user.setRole(Role.USER); // Por defecto le damos rol USER

        // Lo guardamos en la base de datos
        userRepository.save(user);

        /*// Generamos token JWT
        String jwt = jwtService.generateToken(user);*/

        return new AuthResponse(null, "Usuario registrado exitosamente.", true);
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
        // Buscar al usuario por username
        Optional<User> optionalUser = userRepository.findByUsername(request.userName());

        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }

        User user = optionalUser.get();

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return new AuthResponse(null, "Contraseña actual incorrecta.", false);
        }

        // Actualizar la contraseña
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Generar nuevo JWT
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Contraseña actualizada con éxito.", true);
    }
}