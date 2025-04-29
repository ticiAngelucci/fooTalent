package BackEnd.GestorAlquileres.Tenants.DTOs;

import java.util.List;

public record TenantsPageResponseDto(
        List<TenantsResponseDto> dto,
        int page,
        long size
) {
}
