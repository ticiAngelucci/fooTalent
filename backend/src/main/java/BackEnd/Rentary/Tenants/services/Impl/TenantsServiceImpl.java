package BackEnd.Rentary.Tenants.services.Impl;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import BackEnd.Rentary.Common.Service.FileUploadService;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Exceptions.*;
import BackEnd.Rentary.Tenants.DTOs.*;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.mappers.TenantsMapper;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import BackEnd.Rentary.Tenants.services.TenantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Validated
public class TenantsServiceImpl implements TenantsService {
    private final TenantsRepository tenantsRepository;
    private final TenantsMapper tenantsMapper;
    private final FileUploadService fileUploadService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    @Transactional(readOnly = true)
    public TenantsPageResponseDto findAllTenants(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String email = getCurrentUserEmail();
        Page<Tenants> tenantPage = tenantsRepository.findByCreatedBy(email, pageable);
        List<TenantsResponseDto> tenantsDtos = tenantPage.getContent().stream()
                .map(tenantsMapper::toDto)
                .collect(Collectors.toList());

        return new TenantsPageResponseDto(
                tenantsDtos,
                page,
                tenantPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "tenant", key = "#id")
    public TenantsResponseDto findTenantsById(Long id) {
        Tenants tenant = tenantsRepository.findByIdAndCreatedBy(id, getCurrentUserEmail())
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));
        return tenantsMapper.toDto(tenant);
    }

    @Override
    @Transactional
    public TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto, MultipartFile[] documents) {
        if (tenantsRepository.existsByDniAndCreatedBy(tenantsRequestDto.dni(), getCurrentUserEmail())) {
            throw new DuplicateDniException("Ya existe un inquilino con DNI: " + tenantsRequestDto.dni());
        }

        Tenants tenant = tenantsMapper.toEntity(tenantsRequestDto);
        tenant.setCreatedBy(getCurrentUserEmail());

        tenant = tenantsRepository.save(tenant);

        if (documents != null && documents.length > 0) {
            try {
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.TENANT,
                        tenant.getId().toString(),
                        tenant.getDni());

                Set<AttachedDocument> attachedDocs = new HashSet<>();
                for (DocumentUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .id(UUID.randomUUID().toString())
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();
                    attachedDocs.add(doc);
                }

                tenant.setDocuments(attachedDocs);
            } catch (Exception e) {
                throw new FileUploadException("Error al subir documentos: " + e.getMessage());
            }
        }

        return tenantsMapper.toDto(tenantsRepository.save(tenant));
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public TenantsResponseDto updateTenant(Long id, TenantsRequestDto dto, MultipartFile[] documents) {
        Tenants existingTenant = tenantsRepository.findByIdAndCreatedBy(id, getCurrentUserEmail())
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        if (!existingTenant.getDni().equals(dto.dni()) &&
                tenantsRepository.existsByDniAndCreatedBy(dto.dni(), getCurrentUserEmail())) {
            throw new DuplicateDniException("Ya existe otro inquilino con DNI: " + dto.dni());
        }

        existingTenant.setFirstName(dto.firstName());
        existingTenant.setLastName(dto.lastName());
        existingTenant.setEmail(dto.email());
        existingTenant.setPhone(dto.phone());
        existingTenant.setDni(dto.dni());
        existingTenant.setWarranty(dto.warranty());

        if (existingTenant.getAddress() != null) {
            existingTenant.getAddress().setCountry(dto.address().getCountry());
            existingTenant.getAddress().setProvince(dto.address().getProvince());
            existingTenant.getAddress().setLocality(dto.address().getLocality());
            existingTenant.getAddress().setStreet(dto.address().getStreet());
            existingTenant.getAddress().setNumber(dto.address().getNumber());
            existingTenant.getAddress().setPostalCode(dto.address().getPostalCode());
        }

        if (documents != null && documents.length > 0) {
            try {
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.TENANT,
                        existingTenant.getId().toString(),
                        existingTenant.getDni());

                for (DocumentUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();

                    existingTenant.getDocuments().add(doc);
                }

            } catch (Exception e) {
                throw new FileUploadException("Error al actualizar documentos: " + e.getMessage());
            }
        }

        return tenantsMapper.toDto(tenantsRepository.save(existingTenant));
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public void deleteTenant(Long id) {
        Tenants tenant = tenantsRepository.findByIdAndCreatedBy(id, getCurrentUserEmail())
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        boolean hasActiveContract = tenant.getContracts().stream().anyMatch(Contract::isActive);
        if (hasActiveContract) {
            throw new TenantHasActiveContractException("El inquilino tiene al menos un contrato activo.");
        }

        List<String> publicIds = tenant.getDocuments().stream()
                .map(AttachedDocument::getPublicId)
                .filter(pid -> pid != null && !pid.isEmpty())
                .collect(Collectors.toList());

        if (!publicIds.isEmpty()) {
            try {
                fileUploadService.deleteMultipleFiles(publicIds);
            } catch (Exception e) {
                throw new FileUploadException("Error al eliminar documentos: " + e.getMessage());
            }
        }

        tenantsRepository.delete(tenant);
    }

    @Override
    @Transactional
    public void removeTenantDocumentById(Long tenantId, String documentId) {
        Tenants tenant = tenantsRepository.findByIdAndCreatedBy(tenantId, getCurrentUserEmail())
                .orElseThrow(() -> new TenantNotFoundExceptions(tenantId.toString()));

        AttachedDocument docToRemove = tenant.getDocuments().stream()
                .filter(doc -> doc.getId() != null && doc.getId().equals(documentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró el documento para el inquilino"));

        String publicId = docToRemove.getPublicId();
        tenant.getDocuments().remove(docToRemove);
        tenantsRepository.save(tenant);

        try {
            fileUploadService.deleteFile(publicId);
        } catch (Exception e) {
            throw new FileUploadException("Error al eliminar documento: " + e.getMessage());
        }
    }
}
