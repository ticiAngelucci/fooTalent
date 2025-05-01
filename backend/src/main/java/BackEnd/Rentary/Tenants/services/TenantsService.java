package BackEnd.Rentary.Tenants.services;


import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;

public interface TenantsService {
    TenantsPageResponseDto findAllTenants(int page, int size);

    TenantsResponseDto findTenantsById(Long id);

    TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto);

    TenantsResponseDto updateTenant(TenantsRequestDto dto);

    void deleteTenant(Long id);
}
