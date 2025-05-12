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
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
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
            log.error("Ya existe un inmueble con la dirección: {}", property.getAddress());
            throw new PropertyAddressExistsException("Ya existe un inmueble con la dirección especificada.");
        }

        log.info("Creando nueva propiedad para propietario ID: {}", dto.ownerId());
        propertyRepository.save(property);
        return propertyMapper.toDto(property);
    }

    @Override
    public PropertyResponseDto changePropertyStatus(Long propertyId, PropertyStatus newStatus) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException(propertyId.toString()));

        log.info("Cambiando estado de propiedad ID: {} a: {}", propertyId, newStatus);
        property.setStatus(newStatus);
        Property updateProperty = propertyRepository.save(property);

        return propertyMapper.toDto(updateProperty);
    }

    @Override
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Inmueble con ID: " + id + " no encontrado."));

        log.info("Marcando propiedad ID: {} como NO_DISPONIBLE", id);
        property.setStatus(PropertyStatus.NO_DISPONIBLE);
        propertyRepository.save(property);
    }

    @Override
    public Page<PropertyResponseDto> getAllActivePropertiesFiltered(String locality, TypeOfProperty type, Pageable pageable) {
        log.info("Buscando propiedades disponibles con filtros - Localidad: {}, Tipo: {}", locality, type);
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
            log.error("No se puede editar. El inmueble ID: {} fue eliminado.", propertyId);
            throw new PropertyDeletedStatusException("No se puede editar. Este inmueble fue eliminado.");
        }

        Address newAddress = dto.address();
        Address currentAddress = existingProperty.getAddress();

        if (!newAddress.equals(currentAddress) && propertyRepository.existsByAddress(newAddress)) {
            log.error("Ya existe un inmueble con la dirección: {}", newAddress);
            throw new PropertyAddressExistsException("Ya existe un inmueble con la dirección especificada.");
        }

        log.info("Actualizando propiedad ID: {}", propertyId);
        existingProperty.setAddress(newAddress);
        existingProperty.setTypeOfProperty(dto.typeOfProperty());
        existingProperty.setStatus(PropertyStatus.DISPONIBLE);
        existingProperty.setObservations(dto.observations());

        Property updated = propertyRepository.save(existingProperty);
        return propertyMapper.toDto(updated);
    }

    @Override
    public Page<PropertyResponseDto> getAllProperties(Pageable pageable) {
        log.info("Obteniendo todas las propiedades - Página: {}, Tamaño: {}",
                pageable.getPageNumber(), pageable.getPageSize());
        return propertyRepository.findAll(pageable)
                .map(propertyMapper::toDto);
    }
}