package BackEnd.Rentary.Search.Service;

import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    private final OwnerRepository ownerRepository;
    private final TenantsRepository tenantRepository;
    private final PropertyRepository propertyRepository;

    @Autowired
    public SearchService(OwnerRepository ownerRepository, TenantsRepository tenantRepository,
                         PropertyRepository propertyRepository) {
        this.ownerRepository = ownerRepository;
        this.tenantRepository = tenantRepository;
        this.propertyRepository = propertyRepository;
    }

    public Map<String, Object> search(String term, String entityType) {
        Map<String, Object> result = new HashMap<>();

        // Si se especifica un tipo de entidad, se busca solo en esa entidad
        if ("owner".equalsIgnoreCase(entityType)) {
            List<Owner> owners = ownerRepository.findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, term, term);
            result.put("owners", owners);
        } else if ("tenant".equalsIgnoreCase(entityType)) {
            List<Tenants> tenants = tenantRepository.findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, term, term);
            result.put("tenants", tenants);
        } else if ("property".equalsIgnoreCase(entityType)) {
            List<Property> properties = propertyRepository.findByAddressStreetContainingIgnoreCaseOrTypeOfPropertyContainingIgnoreCaseOrObservationsContainingIgnoreCase(term, term, term);
            result.put("properties", properties);
        } else {
            // Si no se especifica entidad o es incorrecto, busca en todas las entidades
            List<Owner> owners = ownerRepository.findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, term, term);
            List<Tenants> tenants = tenantRepository.findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDniContainingIgnoreCaseOrEmailContainingIgnoreCase(term, term, term, term);
            List<Property> properties = propertyRepository.findByAddressStreetContainingIgnoreCaseOrTypeOfPropertyContainingIgnoreCaseOrObservationsContainingIgnoreCase(term, term, term);

            result.put("owners", owners);
            result.put("tenants", tenants);
            result.put("properties", properties);
        }

        return result;
    }
}
