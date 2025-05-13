package BackEnd.Rentary.Tenants.mappers;

import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.stereotype.Component;

@Component
public class TenantsMapper {

    public Tenants toEntity(TenantsRequestDto dto) {
        Tenants tenant = new Tenants();
        tenant.setFirstName(dto.firstName());
        tenant.setLastName(dto.lastName());
        tenant.setEmail(dto.email());
        tenant.setPhone(dto.phone());
        tenant.setDni(dto.dni());
        tenant.setWarranty(dto.warranty());
        tenant.setAddress(dto.address());
        return tenant;
    }

    public TenantsResponseDto toDto(Tenants tenant) {
        return new TenantsResponseDto(
                tenant.getId(),
                tenant.getFirstName(),
                tenant.getLastName(),
                tenant.getEmail(),
                tenant.getPhone(),
                tenant.getDni(),
                tenant.getWarranty(),
                tenant.getAttachedDocument(),
                tenant.getAddress()
        );
    }
}
