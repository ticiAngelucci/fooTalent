package BackEnd.GestorAlquileres.Owners.Repositories;

import BackEnd.GestorAlquileres.Owners.Entities.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
}