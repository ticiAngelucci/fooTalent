package BackEnd.Rentary.Tenants.repositories;

import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, Long> {
    boolean existsByDni(String dni);
    List<Tenants> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String lastName, String dni, String email);
}
