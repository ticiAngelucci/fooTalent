package BackEnd.Rentary.Tenants.services.Impl;

import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.mappers.TenantsMapper;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import BackEnd.Rentary.Tenants.services.TenantsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Validated
public class TenantsServiceImpl implements TenantsService {
    private final TenantsRepository tenantsRepository;
    private final TenantsMapper tenantsMapper;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public TenantsPageResponseDto findAllTenants(int page, int size) {
        log.info("Iniciando findAllTenant con page:{} y size {}",page,size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Tenants> tenantPage = tenantsRepository.findAll(pageable);
        List<TenantsResponseDto> tenantsDtos = tenantPage.stream()
                .map(tenant -> modelMapper.map(tenant,TenantsResponseDto.class))
                .toList();
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "tenant", key = "#id")
    public TenantsResponseDto findTenantsById(Long id) {
        return null;
    }

    @Override
    @Transactional
    public TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto) {
        return null;
    }

    @Override
    @Transactional
    public TenantsResponseDto updateTenant(TenantsRequestDto dto) {
        return null;
    }

    @Override
    @Transactional
    public void deleteTenant(Long id) {

    }
}
