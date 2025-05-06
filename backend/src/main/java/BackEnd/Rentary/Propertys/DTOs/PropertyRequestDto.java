package BackEnd.Rentary.Propertys.DTOs;

import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;

public record PropertyRequestDto(
        String country,
        String province,
        String locality,
        String street,
        String number,
        String postalCode,
        TypeOfProperty typeOfProperty,
        String observations,
        Long ownerId
) {}
