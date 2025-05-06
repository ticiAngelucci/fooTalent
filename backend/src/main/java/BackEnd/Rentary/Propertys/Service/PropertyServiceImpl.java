package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import BackEnd.Rentary.Propertys.Mapper.PropertyMapper;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements IPropertyService {

    private final PropertyRepository propertyRepository;
    private final OwnerRepository ownerRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Transactional
    public PropertyResponseDto createProperty(PropertyRequestDto dto, Long userId) {
        Owner owner = ownerRepository.findById(dto.ownerId())
                .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

        Property property = propertyMapper.toEntity(dto, owner);
        propertyRepository.save(property);

        return propertyMapper.toDto(property);
    }

    @Override
    public PropertyResponseDto changePropertyStatus(Long propertyId, PropertyStatus newStatus) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(()-> new RuntimeException("Inmueble no encontrado."));
        property.setStatus(newStatus);
        Property updateProperty = propertyRepository.save(property);

        return propertyMapper.toDto(updateProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inmueble no encontrado"));

        property.setStatus(PropertyStatus.NO_DISPONIBLE);
        propertyRepository.save(property);
    }

    @Override
    public Page<PropertyResponseDto> getAllActivePropertiesFiltered(String locality, TypeOfProperty type, Pageable pageable) {
        Page<Property> properties = propertyRepository.findAvailablePropertiesWithFilters(locality, type, pageable);

        if (properties.isEmpty()){
            return Page.empty();
        }

        return properties.map(propertyMapper::toDto);
    }
}
