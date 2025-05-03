package BackEnd.Rentary.OAuth2.Util;

import BackEnd.Rentary.Auth.Enums.Role;
import BackEnd.Rentary.Auth.Services.JwtService;
import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    @Value("${URL_FRONT}")
    private String frontUrl;

    public OAuth2LoginSuccessHandler(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        Map<String, Object> attributes = authToken.getPrincipal().getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        User user = userService.findOrCreateUser(email, name);
        String jwt = jwtService.generateToken(user);
        user.setRole(Role.USER);
        user.setIsActive(true);


        // Redirigir al frontend con el token JWT como parámetro o header
        //url de prueba, una vez testeado, se borra "http://localhost:5500/success.html?token=" + jwt;/*"http://localhost:8080/Oauth/login-success"
        String redirectUrl = frontUrl + "/oauth2/redirect?token=" + jwt;
        /*lo dejo en caso de falla se prueba, una vez testeado se lo borra*/
        System.out.println(jwt);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
