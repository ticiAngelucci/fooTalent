package BackEnd.Rentary.Users.Services;

import BackEnd.Rentary.Auth.DTOs.AuthResponse;
import BackEnd.Rentary.Auth.DTOs.CustomUserDetails;
import BackEnd.Rentary.Auth.Enums.Role;
import BackEnd.Rentary.Auth.Util.UserValidation;
import BackEnd.Rentary.Users.Repositories.UserRepository;
import BackEnd.Rentary.Users.DTOs.UserDTO;
import BackEnd.Rentary.Users.Entities.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final UserValidation userValidation;

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

    public UserDTO convertToDto(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public User findOrCreateUser(String email, String fullName) {
        String normalizedEmail = email.trim().toLowerCase();

        return userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> {
                    String[] nameParts = fullName.trim().split(" ", 2);
                    String firstName = nameParts.length > 0 ? nameParts[0] : "Google";
                    String lastName = nameParts.length > 1 ? nameParts[1] : "User";

                    User user = new User();
                    user.setEmail(normalizedEmail);
                    user.setFirstName(firstName);
                    user.setLastName(lastName);
                    user.setUsername(firstName + " " + lastName);
                    user.setPassword(UUID.randomUUID().toString());
                    user.setRole(Role.USER);
                    user.setIsActive(true);
                    return userRepository.save(user);
                });
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
    }
    public void updateUserProfile(String email, UserDTO updatedUserDTO) {
        User existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        boolean isModified = false;

        if (updatedUserDTO.getFirstName() != null && !updatedUserDTO.getFirstName().equals(existingUser.getFirstName())) {
            AuthResponse firstNameValidation = userValidation.validateName(updatedUserDTO.getFirstName(), "Nombre");
            if (!firstNameValidation.success()) {
                throw new IllegalArgumentException(firstNameValidation.message());
            }
            existingUser.setFirstName(updatedUserDTO.getFirstName());
            isModified = true;
        }

        if (updatedUserDTO.getLastName() != null && !updatedUserDTO.getLastName().equals(existingUser.getLastName())) {
            AuthResponse lastNameValidation = userValidation.validateName(updatedUserDTO.getLastName(), "Apellido");
            if (!lastNameValidation.success()) {
                throw new IllegalArgumentException(lastNameValidation.message());
            }
            existingUser.setLastName(updatedUserDTO.getLastName());
            isModified = true;
        }

        if (isModified) {
            userRepository.save(existingUser);
        } else {
            throw new IllegalArgumentException("No se detectaron cambios para actualizar.");
        }
    }

    public void uploadImage(String email, String imageUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);
    }
}