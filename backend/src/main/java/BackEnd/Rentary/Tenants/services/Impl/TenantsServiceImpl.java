package BackEnd.Rentary.Tenants.services.Impl;

import BackEnd.Rentary.Exceptions.DuplicateDniException;
import BackEnd.Rentary.Exceptions.FileUploadException;
import BackEnd.Rentary.Exceptions.TenantNotFoundExceptions;
import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.mappers.TenantsMapper;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import BackEnd.Rentary.Tenants.services.FileUploadService;
import BackEnd.Rentary.Tenants.services.TenantsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Validated
public class TenantsServiceImpl implements TenantsService {
    private final TenantsRepository tenantsRepository;
    private final TenantsMapper tenantsMapper;
    private final FileUploadService fileUploadService;

    @Override
    @Transactional(readOnly = true)
    public TenantsPageResponseDto findAllTenants(int page, int size) {
        log.info("Iniciando findAllTenant con page:{} y size {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Tenants> tenantPage = tenantsRepository.findAll(pageable);
        List<TenantsResponseDto> tenantsDtos = tenantPage.getContent().stream()
                .map(tenantsMapper::toDto)
                .collect(Collectors.toList());

        return new TenantsPageResponseDto(
                tenantsDtos,
                page,
                tenantPage.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "tenant", key = "#id")
    public TenantsResponseDto findTenantsById(Long id) {
        log.info("Buscando inquilino con ID: {}", id);
        Tenants tenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));
        return tenantsMapper.toDto(tenant);
    }

    @Override
    @Transactional
    public TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto, MultipartFile document) {
        log.info("Guardando nuevo inquilino: {}", tenantsRequestDto.firstName() + " " + tenantsRequestDto.lastName());

        // Verificar si ya existe un inquilino con ese DNI
        if (tenantsRepository.existsByDni((tenantsRequestDto.dni()))) {
            log.error("Ya existe un inquilino con DNI: {}", tenantsRequestDto.dni());
            throw new DuplicateDniException("Ya existe un inquilino con DNI: " + tenantsRequestDto.dni());
        }

        // Convertir DTO a entidad
        Tenants tenant = tenantsMapper.toEntity(tenantsRequestDto);

        // Si hay documento adjunto, subirlo a Cloudinary
        if (document != null && !document.isEmpty()) {
            try {
                String documentUrl = fileUploadService.uploadFile(document);
                tenant.setAttachedDocument(documentUrl);
            } catch (Exception e) {
                log.error("Error al subir documento: {}", e.getMessage());
                throw new FileUploadException("Error al subir el documento: " + e.getMessage());
            }
        }

        Tenants savedTenant = tenantsRepository.save(tenant);
        log.info("Inquilino guardado con ID: {}", savedTenant.getId());

        return tenantsMapper.toDto(savedTenant);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public TenantsResponseDto updateTenant(Long id, TenantsRequestDto dto, MultipartFile document) {
        log.info("Actualizando inquilino con ID: {}", id);

        Tenants existingTenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        // Verificar que el DNI no esté en uso por otro inquilino
        if (!existingTenant.getDni().equals(dto.dni()) &&
                tenantsRepository.existsByDni(dto.dni())) {
            log.error("Ya existe otro inquilino con DNI: {}", dto.dni());
            throw new DuplicateDniException("Ya existe otro inquilino con DNI: " + dto.dni());
        }

        existingTenant.setFirstName(dto.firstName());
        existingTenant.setLastName(dto.lastName());
        existingTenant.setEmail(dto.email());
        existingTenant.setPhone(dto.phone());
        existingTenant.setDni(dto.dni());
        existingTenant.setWarranty(dto.warranty());
        existingTenant.setAddress(dto.address());


        if (document != null && !document.isEmpty()) {
            try {
                String documentUrl = fileUploadService.uploadFile(document);
                existingTenant.setAttachedDocument(documentUrl);
            } catch (Exception e) {
                log.error("Error al actualizar documento: {}", e.getMessage());
                throw new FileUploadException("Error al actualizar el documento: " + e.getMessage());
            }
        }

        Tenants updatedTenant = tenantsRepository.save(existingTenant);
        log.info("Inquilino actualizado con éxito");

        return tenantsMapper.toDto(updatedTenant);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public void deleteTenant(Long id) {
        log.info("Eliminando inquilino con ID: {}", id);

        Tenants tenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        if (tenant.getAttachedDocument() != null && !tenant.getAttachedDocument().isEmpty()) {
            String publicId = extractPublicIdFromUrl(tenant.getAttachedDocument());
            if (publicId != null) {
                try {
                    fileUploadService.deleteFile(publicId);
                } catch (Exception e) {
                    log.warn("No se pudo eliminar el archivo de Cloudinary: {}", e.getMessage());
                }
            }
        }

        tenantsRepository.deleteById(id);
        log.info("Inquilino eliminado con éxito");
    }

    // Método auxiliar para extraer el public_id de una URL de Cloudinary
    private String extractPublicIdFromUrl(String url) {
        try {
            // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1)
                return null;

            String path = url.substring(uploadIndex + 8);
            int lastDotIndex = path.lastIndexOf(".");

            String publicIdWithVersion = lastDotIndex != -1 ? path.substring(0, lastDotIndex) : path;

            int versionEndIndex = publicIdWithVersion.indexOf("/");
            String publicId = versionEndIndex != -1 ?
                    publicIdWithVersion.substring(versionEndIndex + 1) : publicIdWithVersion;

            return "rentary/tenants/documents/" + publicId;
        } catch (Exception e) {
            log.error("Error al extraer public_id de URL: {}", url, e);
            return null;
        }
    }
}