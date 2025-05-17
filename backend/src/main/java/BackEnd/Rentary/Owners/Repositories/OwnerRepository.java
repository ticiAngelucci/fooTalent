package BackEnd.Rentary.Owners.Repositories;

import BackEnd.Rentary.Owners.Entities.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    boolean existsByDni(String dni);
    Optional<Owner> findByIdAndCreatedBy(Long id, String createdBy);
    List<Owner> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(String firstName, String lastName, String dni, String email);
}
