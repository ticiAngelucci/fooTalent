package BackEnd.Rentary.Properties.Repository;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;
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
    WHERE p.status = 'DISPONIBLE'
    AND (:locality IS NULL OR p.address.locality = :locality)
    AND (:type IS NULL OR p.typeOfProperty = :type)
    """)
    Page<Property> findAvailablePropertiesWithFilters(
            @Param("locality") String locality,
            @Param("type") TypeOfProperty type,
            Pageable pageable
    );
    boolean existsByAddress(Address address);

    List<Property> findByAddress_StreetContainingIgnoreCaseOrTypeOfPropertyOrObservationsContainingIgnoreCase(String street, TypeOfProperty typeOfProperty, String observations);

    List<Property> findByAddress_StreetContainingIgnoreCaseOrObservationsContainingIgnoreCase(String street, String observations);
}
