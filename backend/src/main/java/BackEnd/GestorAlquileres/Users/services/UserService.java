package BackEnd.GestorAlquileres.Users.services;

import BackEnd.GestorAlquileres.Auth.enums.Role;
import BackEnd.GestorAlquileres.Auth.repositories.UserRepository;
import BackEnd.GestorAlquileres.Users.DTOs.UserDTO;
import BackEnd.GestorAlquileres.Users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> getUserByIdIfAuthorized(Long id, Authentication auth) {
        User currentUser = (User) auth.getPrincipal();

        if (currentUser.getId().equals(id) || currentUser.getRole() == Role.ADMIN) {
            Optional<User> user = userRepository.findById(id);

            return user.map(value -> ResponseEntity.ok(UserDTO.fromEntity(value)))
                    .orElse(ResponseEntity.notFound().build());
        }

        return ResponseEntity.status(403).body("No autorizado");
    }

}
