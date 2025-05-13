package BackEnd.Rentary.Config;

import BackEnd.Rentary.Auth.Enums.Role;

import BackEnd.Rentary.Users.Entities.User;
import BackEnd.Rentary.Users.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommandInitializerConfig implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = User
                    .builder()
                    .email("rentary@gmail.com")
                    .firstName("Rentary")
                    .lastName("Admin")
                    .password(passwordEncoder.encode("Rentary2025!"))
                    .role(Role.ADMIN)
                    .username("Rentary Admin")
                    .isActive(true)
                    .build();
//            User admin2 = User
//                    .builder()
//
//                    .build();
            userRepository.save(admin);
        }
    }
}
