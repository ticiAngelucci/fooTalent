package BackEnd.Rentary.Propertys.Repositoy;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query("""
    SELECT p FROM Property p
    WHERE p.status = 'NO_ALQUILADO'
    AND (:locality IS NULL OR p.address.locality = :locality)
    AND (:type IS NULL OR p.typeOfProperty = :type)
    """)
    Page<Property> findAvailablePropertiesWithFilters(
            @Param("locality") String locality,
            @Param("type") TypeOfProperty type,
            Pageable pageable
    );
    boolean existsByAddress(Address address);

    List<Property> findByAddressStreetContainingIgnoreCaseOrTypeOfPropertyContainingIgnoreCaseOrObservationsContainingIgnoreCase(String street, String type, String observations);
}
