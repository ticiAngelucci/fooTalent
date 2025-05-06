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
        user.setRole(Role.USER);
        user.setIsActive(true);
        String jwt = jwtService.generateToken(user);


        // HTML que guarda el token y redirige al frontend
        response.setContentType("text/html;charset=UTF-8");
        String html = """
        <!DOCTYPE html>
        <html>
          <head>
            <script>
              localStorage.setItem("jwt", "%s");
              window.location.href = "%s";
            </script>
          </head>
          <body>Redireccionando...</body>
        </html>
        """.formatted(jwt, frontUrl + "/dashboard");

        response.getWriter().write(html);
    }
}
