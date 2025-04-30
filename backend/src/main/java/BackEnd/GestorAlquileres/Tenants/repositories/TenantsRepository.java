package BackEnd.GestorAlquileres.Tenants.repositories;

import BackEnd.GestorAlquileres.Tenants.entities.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, Long> {
}
