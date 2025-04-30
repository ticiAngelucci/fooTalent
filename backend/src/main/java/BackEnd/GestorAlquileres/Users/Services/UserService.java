package BackEnd.GestorAlquileres.Users.Services;

import BackEnd.GestorAlquileres.Auth.DTOs.CustomUserDetails;
import BackEnd.GestorAlquileres.Auth.Enums.Role;
import BackEnd.GestorAlquileres.Users.Repositories.UserRepository;
import BackEnd.GestorAlquileres.Users.DTOs.UserDTO;
import BackEnd.GestorAlquileres.Users.Entities.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final ModelMapper modelMapper;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> getUserByIdIfAuthorized(Long id, Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User currentUser = userDetails.user();

        if (currentUser.getId().equals(id) || currentUser.getRole() == Role.ADMIN) {
            Optional<User> user = userRepository.findById(id);

            return user.map(value -> ResponseEntity.ok(convertToDto(value)))
                    .orElse(ResponseEntity.notFound().build());

        }
        return ResponseEntity.status(403).body("No autorizado");
    }

    public void deleteUsuario(Long id) {
        User usuario = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setIsActive(false);
        userRepository.save(usuario);
    }

    public Page<User> getActiveUsers(Pageable pageable) {
        return userRepository.findAllUserByIsActiveTrue(pageable);
    }

    // Entity to DTO
    private UserDTO convertToDto (User user) {
        return modelMapper.map(user, UserDTO.class);
    }
}