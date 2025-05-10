package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Common.Address;
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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Propietario no encontrado. Por favor, verifique su ID."));

        Property property = propertyMapper.toEntity(dto, owner);
        if (propertyRepository.existsByAddress(property.getAddress())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un inmueble con esa dirección.");
        }

        propertyRepository.save(property);
        return propertyMapper.toDto(property);
    }

    @Override
    public PropertyResponseDto changePropertyStatus(Long propertyId, PropertyStatus newStatus) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inmuele no encontrado. Por favor, verifique su ID."));
        property.setStatus(newStatus);
        Property updateProperty = propertyRepository.save(property);

        return propertyMapper.toDto(updateProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inmuele no encontrado. Por favor, verifique su ID."));

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

    @Override
    @Transactional
    public PropertyResponseDto updateProperty(Long propertyId, PropertyRequestDto dto) {
        Property existingProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inmuele no encontrado. Por favor, verifique su ID."));

        if (existingProperty.getStatus() == PropertyStatus.NO_DISPONIBLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede editar. Este inmueble fue eliminado.");
        }

        Address newAddress = dto.address();
        Address currentAddress = existingProperty.getAddress();

        if (!newAddress.equals(currentAddress) &&
                propertyRepository.existsByAddress(newAddress)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un inmueble con esa dirección.");
        }

        existingProperty.setAddress(newAddress);
        existingProperty.setTypeOfProperty(dto.typeOfProperty());
        existingProperty.setStatus(PropertyStatus.DISPONIBLE);
        existingProperty.setObservations(dto.observations());

        Property updated = propertyRepository.save(existingProperty);
        return propertyMapper.toDto(updated);
    }

    @Override
    public Page<PropertyResponseDto> getAllProperties(Pageable pageable) {
        return propertyRepository.findAll(pageable)
                .map(propertyMapper::toDto);
    }
}
