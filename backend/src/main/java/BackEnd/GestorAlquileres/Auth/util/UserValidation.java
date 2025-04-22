package BackEnd.GestorAlquileres.Auth.util;

import BackEnd.GestorAlquileres.Auth.DTOs.AuthResponse;
import BackEnd.GestorAlquileres.Users.User;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class UserValidation {

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z]{2,}$");
    private static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$";

    public AuthResponse validate(User user) {

        if (user.getEmail() == null || !EMAIL_REGEX.matcher(user.getEmail()).matches()) {
            return new AuthResponse(null, "El email no tiene formato válido", false);
        }

        if (user.getPassword() == null || !user.getPassword().matches(PASSWORD_REGEX)) {
            return new AuthResponse(null, "La contraseña debe tener entre 8 y 16 caracteres, al menos un número, una minúscula y una mayúscula.", false);
        }

        return new AuthResponse(null, "Validación exitosa", true);
    }
}