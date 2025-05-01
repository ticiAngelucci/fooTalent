package BackEnd.Rentary.Propertys.DTOs;

import BackEnd.Rentary.Common.Address;

public record PropertyResponseDto(
        Long id_property,
        Address address,
        String observations
) {}