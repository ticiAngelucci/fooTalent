package BackEnd.Rentary.Properties.DTOs;

import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;

public record PropertyResponseDto(
        Long id_property,
        String country,
        String province,
        String locality,
        String street,
        String number,
        String postalCode,
        TypeOfProperty typeOfProperty,
        PropertyStatus propertyStatus,
        String observations,
        Long ownerId,
        String firstName,
        String lastName
) {}
