package BackEnd.GestorAlquileres.Auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import BackEnd.GestorAlquileres.Users.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findByIsActiveTrue();
    Optional<User> findByEmail(String email);
}