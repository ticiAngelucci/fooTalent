package BackEnd.Rentary.Users.Controller;

import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Services.UserService;
import BackEnd.Rentary.Users.DTOs.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('user')")
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

   }