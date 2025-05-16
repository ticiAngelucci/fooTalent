package BackEnd.Rentary.Owners.DTOs;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Common.DTOs.DocumentDto;

import java.util.Set;

public record OwnerResponseDto(
        Long idOwner,
        String firstName,
        String lastName,
        String dni,
        String email,
        String phone,
        Address address,
        Set<DocumentDto> documents
) {}
