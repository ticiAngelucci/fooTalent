package BackEnd.Rentary.Propertys.DTOs;

import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;

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
        String observations
) {}
