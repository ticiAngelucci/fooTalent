package BackEnd.Rentary.OAuth2.Controller;

import BackEnd.Rentary.Auth.DTOs.AuthResponse;
import BackEnd.Rentary.Auth.Services.JwtService;
import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Oauth")
public class OAuth2AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    // Endpoint que maneja el éxito de OAuth2 (cuando el login con Google es exitoso)
    @GetMapping("/oauth2/success")
    public AuthResponse oauth2Success(@AuthenticationPrincipal OAuth2User principal) {
        // Obtener los datos del usuario desde Google
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        // Buscar o crear el usuario
        User user = userService.findOrCreateUser(email, name);

        // Generar el JWT
        String token = jwtService.generateToken(user);

        // Devolver la respuesta con el token
        return new AuthResponse(token, "Inicio de sesión con Google exitoso", true);
    }
    //para prueba local, despues se borra
    @GetMapping("/login-success")
    public String loginSuccessMessage() {
        return "Inicio de sesión exitoso (prueba local)";
    }
}
