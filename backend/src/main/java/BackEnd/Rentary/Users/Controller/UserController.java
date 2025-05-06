package BackEnd.Rentary.Users.Controller;

import BackEnd.Rentary.Auth.Services.JwtService;
import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Services.UserService;
import BackEnd.Rentary.Users.DTOs.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/getUserByID/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, Authentication auth) {
        return userService.getUserByIdIfAuthorized(id, auth);
    }

    @DeleteMapping("/getUserByID/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Long id) {
        userService.deleteUsuario(id);
        return ResponseEntity.ok("Usuario eliminado lógicamente.");
    }

    @GetMapping("/active")
    public Page<User> getAllActiveUsers(@PageableDefault(size = 10, sort = "username") Pageable pageable) {
        return userService.getActiveUsers(pageable);
    }
    // endpoint para obtener data del usuario desde el JWT
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.getUserByEmail(email);
        UserDTO userDTO = userService.convertToDto(user);
        return ResponseEntity.ok(userDTO);
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserDTO updatedUserDTO
    ) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado o inválido.");
            }

            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se pudo extraer el usuario del token.");
            }

            userService.updateUserProfile(email, updatedUserDTO);
            return ResponseEntity.ok("Perfil actualizado correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al actualizar el perfil.");
        }
    }

}

