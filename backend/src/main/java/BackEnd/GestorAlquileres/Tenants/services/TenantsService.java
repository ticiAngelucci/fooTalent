package BackEnd.GestorAlquileres.Tenants.services;


import BackEnd.GestorAlquileres.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.GestorAlquileres.Tenants.DTOs.TenantsRequestDto;
import BackEnd.GestorAlquileres.Tenants.DTOs.TenantsResponseDto;

public interface TenantsService {
    TenantsPageResponseDto findAllTenants(int page, int size);

    TenantsResponseDto findTenantsById(Long id);

    TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto);

    TenantsResponseDto updateTenant(TenantsRequestDto dto);

    void deleteTenant(Long id);
}
