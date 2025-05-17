package BackEnd.Rentary.Tenants.repositories;

import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, Long> {
    boolean existsByDni(String dni);

    boolean existsByDniAndCreatedBy(String dni, String createdBy);

    Page<Tenants> findByCreatedBy(String createdBy, Pageable pageable);

    Optional<Tenants> findByIdAndCreatedBy(Long id, String createdBy);

    List<Tenants> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String lastName, String dni, String email
    );
}
