package BackEnd.Rentary.Properties.Mapper;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Properties.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import org.springframework.stereotype.Component;

@Component
public class PropertyMapper {

    public PropertyResponseDto toDto(Property property) {
        Address address = property.getAddress();
        return new PropertyResponseDto(
                property.getIdProperty(),
                address.getCountry(),
                address.getProvince(),
                address.getLocality(),
                address.getStreet(),
                address.getNumber(),
                address.getPostalCode(),
                property.getTypeOfProperty(),
                property.getStatus(),
                property.getObservations(),
                property.getOwner().getId(),
                property.getOwner().getFirstName(),
                property.getOwner().getLastName()
        );
    }

    public Property toEntity(PropertyRequestDto dto, Owner owner) {
        Property property = new Property();
        property.setAddress(dto.address());
        property.setTypeOfProperty(dto.typeOfProperty());
        property.setStatus(PropertyStatus.DISPONIBLE);
        property.setObservations(dto.observations());
        property.setOwner(owner);

        return property;
    }
}
