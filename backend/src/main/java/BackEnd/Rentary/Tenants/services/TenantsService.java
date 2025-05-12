package BackEnd.Rentary.Tenants.services;

import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface TenantsService {
    TenantsPageResponseDto findAllTenants(int page, int size);

    TenantsResponseDto findTenantsById(Long id);

    TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto, MultipartFile[] documents);

    TenantsResponseDto updateTenant(Long id, TenantsRequestDto dto, MultipartFile[] documents);

    void deleteTenant(Long id);
}