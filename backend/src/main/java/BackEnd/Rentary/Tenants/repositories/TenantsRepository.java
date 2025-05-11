package BackEnd.Rentary.Tenants.repositories;

import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, Long> {

    List<Tenants> findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String lastName, String dni, String email);

}
