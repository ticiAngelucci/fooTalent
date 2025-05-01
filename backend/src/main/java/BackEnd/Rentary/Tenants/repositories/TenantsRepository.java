package BackEnd.Rentary.Tenants.repositories;

import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, Long> {
}
