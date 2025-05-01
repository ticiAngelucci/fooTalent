package BackEnd.Rentary.Tenants.DTOs;

import java.util.List;

public record TenantsPageResponseDto(
        List<TenantsResponseDto> dto,
        int page,
        long size
) {
}
