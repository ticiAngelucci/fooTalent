package BackEnd.Rentary.Tenants.DTOs;

import BackEnd.Rentary.Common.Address;

public record TenantsResponseDto (
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String dni,
        String warranty,
        String attachedDocument,
        Address address
) {}