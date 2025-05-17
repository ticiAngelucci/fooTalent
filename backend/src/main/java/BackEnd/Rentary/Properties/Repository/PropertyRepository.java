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
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    boolean existsByAddress(Address address);

    Optional<Property> findByidPropertyAndCreatedBy(Long idProperty, String createdBy);

    Page<Property> findByCreatedBy(String createdBy, Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.status = 'DISPONIBLE'
        AND p.createdBy = :createdBy
        AND (:locality IS NULL OR p.address.locality = :locality)
        AND (:type IS NULL OR p.typeOfProperty = :type)
    """)
    Page<Property> findAvailablePropertiesWithFiltersAndCreatedBy(
            @Param("locality") String locality,
            @Param("type") TypeOfProperty type,
            @Param("createdBy") String createdBy,
            Pageable pageable
    );

    List<Property> findByAddress_StreetContainingIgnoreCaseOrTypeOfPropertyOrObservationsContainingIgnoreCase(String street, TypeOfProperty typeOfProperty, String observations);

    List<Property> findByAddress_StreetContainingIgnoreCaseOrObservationsContainingIgnoreCase(String street, String observations);
}
