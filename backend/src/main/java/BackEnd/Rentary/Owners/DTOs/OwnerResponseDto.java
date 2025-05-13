package BackEnd.Rentary.Owners.DTOs;

import BackEnd.Rentary.Common.Address;

public record OwnerResponseDto(
        Long idOwner,
        String firstName,
        String lastName,
        String dni,
        String email,
        String phone,
        Address address,
        String attachedDocument
) {}
