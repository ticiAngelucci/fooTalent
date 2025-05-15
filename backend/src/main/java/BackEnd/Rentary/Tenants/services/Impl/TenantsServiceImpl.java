package BackEnd.Rentary.Tenants.services.Impl;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import BackEnd.Rentary.Common.Service.FileUploadService;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Exceptions.DuplicateDniException;
import BackEnd.Rentary.Exceptions.FileUploadException;
import BackEnd.Rentary.Exceptions.TenantHasActiveContractException;
import BackEnd.Rentary.Exceptions.TenantNotFoundExceptions;
import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.mappers.TenantsMapper;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import BackEnd.Rentary.Tenants.services.TenantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Override
    @Transactional(readOnly = true)
    public TenantsPageResponseDto findAllTenants(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Tenants> tenantPage = tenantsRepository.findAll(pageable);
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
        Tenants tenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));
        return tenantsMapper.toDto(tenant);
    }

    @Override
    @Transactional
    public TenantsResponseDto saveTenant(TenantsRequestDto tenantsRequestDto, MultipartFile[] documents) {

        if (tenantsRepository.existsByDni((tenantsRequestDto.dni()))) {
            throw new DuplicateDniException("Ya existe un inquilino con DNI: " + tenantsRequestDto.dni());
        }

        Tenants tenant = tenantsMapper.toEntity(tenantsRequestDto);

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

        Tenants savedTenant = tenantsRepository.save(tenant);
        return tenantsMapper.toDto(savedTenant);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public TenantsResponseDto updateTenant(Long id, TenantsRequestDto dto, MultipartFile[] documents) {
        Tenants existingTenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        if (!existingTenant.getDni().equals(dto.dni()) &&
                tenantsRepository.existsByDni(dto.dni())) {
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

        Tenants updatedTenant = tenantsRepository.save(existingTenant);

        return tenantsMapper.toDto(updatedTenant);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tenant", key = "#id")
    public void deleteTenant(Long id) {

        Tenants tenant = tenantsRepository.findById(id)
                .orElseThrow(() -> new TenantNotFoundExceptions(id.toString()));

        boolean hasActiveContract = tenant.getContracts().stream().anyMatch(Contract::isActive);

        if (hasActiveContract) {
            throw new TenantHasActiveContractException("El inquilino ya tiene al menos un contrato activo y no puede ser eliminado.");
        }

        List<String> publicIds = new ArrayList<>();

        for (AttachedDocument doc : tenant.getDocuments()) {
            if (doc.getPublicId() != null && !doc.getPublicId().isEmpty()) {
                publicIds.add(doc.getPublicId());
            }
        }

        if (!publicIds.isEmpty()) {
            try {
                fileUploadService.deleteMultipleFiles(publicIds);
            } catch (Exception e) {
                throw new FileUploadException("Error al eliminar algunos documentos de Cloudinary: " + e.getMessage());
            }
        }

        tenantsRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void removeTenantDocumentById(Long tenantId, String documentId) {

        Tenants tenant = tenantsRepository.findById(tenantId)
                .orElseThrow(() -> new TenantNotFoundExceptions(tenantId.toString()));

        AttachedDocument docToRemove = null;
        for (AttachedDocument doc : tenant.getDocuments()) {
            if (doc.getId() != null && doc.getId().equals(documentId)) {
                docToRemove = doc;
                break;
            }
        }

        if (docToRemove != null) {
            // Guardar el publicId para eliminarlo de Cloudinary
            String publicId = docToRemove.getPublicId();

            // Eliminar el documento de la colección
            tenant.getDocuments().remove(docToRemove);
            tenantsRepository.save(tenant);

            // Eliminar de Cloudinary
            try {
                fileUploadService.deleteFile(publicId);
                throw new RuntimeException("Documento eliminado del inquilino ID");
            } catch (Exception e) {
                throw new FileUploadException("Error al eliminar documento de Cloudinary: " + e.getMessage());
            }
        } else {
            throw new RuntimeException("No se encontró el documento para el inquilino");
        }
    }
}