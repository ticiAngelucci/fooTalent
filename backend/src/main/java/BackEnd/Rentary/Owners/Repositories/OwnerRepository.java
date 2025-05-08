package BackEnd.Rentary.Owners.Repositories;

import BackEnd.Rentary.Owners.Entities.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    boolean existsByDni(String dni);
}
