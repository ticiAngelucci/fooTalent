package BackEnd.Rentary.Owners.Repositories;

import BackEnd.Rentary.Owners.Entities.Owner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Page<Owner> findByCreatedBy(String email, Pageable pageable);
    boolean existsByDniAndCreatedBy(String dni, String email);
    Optional<Owner> findByIdAndCreatedBy(Long id, String email);
    List<Owner> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(String firstName, String lastName, String dni, String email);
    }
