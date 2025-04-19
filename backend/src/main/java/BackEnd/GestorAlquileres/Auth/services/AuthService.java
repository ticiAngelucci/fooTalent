package BackEnd.GestorAlquileres.Auth.services;

import BackEnd.GestorAlquileres.Auth.DTOs.AuthResponse;
import BackEnd.GestorAlquileres.Auth.DTOs.LoginRequest;
import BackEnd.GestorAlquileres.Auth.DTOs.RegisterRequest;
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

        // Generamos token JWT
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Usuario registrado exitosamente.", true);
    }

    public AuthResponse login(LoginRequest request) {
        // Verificar si el usuario existe antes de autenticar
        Optional<User> optionalUser = userRepository.findByUsername(request.username());
        if (optionalUser.isEmpty()) {
            return new AuthResponse(null, "Usuario no encontrado.", false);
        }
        try {
            // Autenticamos con Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username(),
                            request.password()
                    )
            );
        } catch (Exception e) {
            // Contraseña incorrecta o autenticación fallida
            return new AuthResponse(null, "Contraseña incorrecta.", false);
        }

        // Si todo está bien generamos el token JWT
        User user = optionalUser.get();
        String jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, "Usuario autenticado exitosamente.", true);
    }
}