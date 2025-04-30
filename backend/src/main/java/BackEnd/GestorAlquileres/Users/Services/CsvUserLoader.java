package BackEnd.GestorAlquileres.Users.Services;

import BackEnd.GestorAlquileres.Auth.Enums.Role;
import BackEnd.GestorAlquileres.Users.Repositories.UserRepository;
import BackEnd.GestorAlquileres.Users.Entities.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvUserLoader {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public List<User> loadUsersFromCsv(InputStream csvFile) throws Exception {
        List<User> users = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(csvFile))){
            String line;
            boolean isFirtsLine = true;
            while ((line = br.readLine()) != null) {
                if (isFirtsLine) {
                    isFirtsLine = false;
                    continue;
                }
                String[] data = line.split(",");
                if (data.length >= 5) {
                    User user = new User();
                    user.setUsername(data[0].trim());
                    user.setEmail(data[1].trim());
                    user.setPassword(passwordEncoder.encode(data[2].trim()));
                    user.setRole(Role.valueOf(data[3].trim()));
                    user.setIsActive(Boolean.parseBoolean(data[4].trim()));
                    users.add(user);
                }
            }
            return userRepository.saveAll(users);
        }
    }
}