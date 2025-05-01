package BackEnd.Rentary.Propertys.Repositoy;

import BackEnd.Rentary.Propertys.Entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}