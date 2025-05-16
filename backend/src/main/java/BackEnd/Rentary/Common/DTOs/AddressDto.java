package BackEnd.Rentary.Common.DTOs;

public record AddressDto(
        String country,
        String province,
        String locality,
        String street,
        String number,
        String postalCode
) {}
