package BackEnd.Rentary.Search.Service;

import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;
import BackEnd.Rentary.Properties.Repository.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RequiredArgsConstructor
@Service
public class SearchService {

    private final OwnerRepository ownerRepository;
    private final TenantsRepository tenantRepository;
    private final PropertyRepository propertyRepository;

    public Map<String, Object> search(String term, String entityType) {
        Map<String, Object> result = new HashMap<>();

        TypeOfProperty type = parseTypeOfProperty(term);

        if ("owner".equalsIgnoreCase(entityType)) {
            List<Owner> owners = ownerRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            term, term, term, term);
            result.put("owners", owners);

        } else if ("tenant".equalsIgnoreCase(entityType)) {
            List<Tenants> tenants = tenantRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            term, term, term, term);
            result.put("tenants", tenants);

        } else if ("property".equalsIgnoreCase(entityType)) {
            List<Property> properties;
            if (type != null) {
                properties = propertyRepository
                        .findByAddress_StreetContainingIgnoreCaseOrTypeOfPropertyOrObservationsContainingIgnoreCase(
                                term, type, term);
            } else {
                properties = propertyRepository
                        .findByAddress_StreetContainingIgnoreCaseOrObservationsContainingIgnoreCase(term, term);
            }
            result.put("properties", properties);

        } else {
            List<Owner> owners = ownerRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            term, term, term, term);
            List<Tenants> tenants = tenantRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            term, term, term, term);
            List<Property> properties;
            if (type != null) {
                properties = propertyRepository
                        .findByAddress_StreetContainingIgnoreCaseOrTypeOfPropertyOrObservationsContainingIgnoreCase(
                                term, type, term);
            } else {
                properties = propertyRepository
                        .findByAddress_StreetContainingIgnoreCaseOrObservationsContainingIgnoreCase(term, term);
            }

            result.put("owners", owners);
            result.put("tenants", tenants);
            result.put("properties", properties);
        }

        return result;
    }

    private TypeOfProperty parseTypeOfProperty(String term) {
        try {
            return TypeOfProperty.valueOf(term.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return null;
        }
    }
}