package BackEnd.Rentary.Propertys.Service;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Exceptions.*;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import BackEnd.Rentary.Propertys.Mapper.PropertyMapper;
import BackEnd.Rentary.Propertys.Repository.PropertyRepository;
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
                .orElseThrow(() -> new OwnerNotFoundException("Propietario con ID: " + dto.ownerId() + " no encontrado."));

        Property property = propertyMapper.toEntity(dto, owner);
        if (propertyRepository.existsByAddress(property.getAddress())) {
            throw new PropertyAddressExistsException("Ya existe un inmueble con la dirección especificada.");
        }

        propertyRepository.save(property);
        return propertyMapper.toDto(property);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Inmueble con ID: " + id + " no encontrado."));

        propertyRepository.delete(property);
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
                .orElseThrow(() -> new PropertyNotFoundException("Inmueble con ID: " + propertyId + " no encontrado."));

        if (existingProperty.getStatus() == PropertyStatus.NO_DISPONIBLE) {
            throw new PropertyDeletedStatusException("No se puede editar. Este inmueble fue eliminado.");
        }

        Address newAddress = dto.address();
        Address currentAddress = existingProperty.getAddress();

        if (!newAddress.equals(currentAddress) && propertyRepository.existsByAddress(newAddress)) {
            throw new PropertyAddressExistsException("Ya existe un inmueble con la dirección especificada.");
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

    @Override
    public PropertyResponseDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException(id.toString()));
        return propertyMapper.toDto(property);
    }
}