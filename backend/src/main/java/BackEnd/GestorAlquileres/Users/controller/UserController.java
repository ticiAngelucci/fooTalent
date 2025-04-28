package BackEnd.GestorAlquileres.Users.controller;

import BackEnd.GestorAlquileres.Users.User;
import BackEnd.GestorAlquileres.Users.services.CsvUserLoader;
import BackEnd.GestorAlquileres.Users.services.UserService;
import BackEnd.GestorAlquileres.Users.DTOs.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CsvUserLoader csvUserLoader;

    @GetMapping("/getAllUsers")
    @PreAuthorize("hasRole('ADMIN')")
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

    @PostMapping("/upload-csv")
    public List<User> uploadCSV(@RequestParam("file") MultipartFile file) throws Exception {
        if (!file.isEmpty()) {
            return csvUserLoader.loadUsersFromCsv(file.getInputStream());
        }
        throw new RuntimeException("Error al leer el archivo");
    }

    @GetMapping("/active")
    public Page<User> getAllActiveUsers(@PageableDefault(size = 10, sort = "username") Pageable pageable) {
        return userService.getActiveUsers(pageable);
    }
}