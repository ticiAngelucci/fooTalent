package BackEnd.GestorAlquileres.Users.DTOs;

import BackEnd.GestorAlquileres.Users.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String role;

    public static UserDTO fromEntity(@NotNull User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }
}
