package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.FileUploadService;
import BackEnd.Rentary.Common.FileUploadService.FileUploadResult;
import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Mapper.ContractMapper;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.ContractNorFoundException;
import BackEnd.Rentary.Exceptions.FileUploadException;
import BackEnd.Rentary.Exceptions.PropertyNotFoundException;
import BackEnd.Rentary.Exceptions.PropertyUnavailableException;
import BackEnd.Rentary.Exceptions.TenantNotFoundExceptions;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractServiceImpl implements IContractService {

    private final IContractRepository contractRepository;
    private final PropertyRepository propertyRepository;
    private final TenantsRepository tenantsRepository;
    private final ContractMapper contractMapper;
    private final FileUploadService fileUploadService;

    @Override
    @Transactional
    public ContractResponse createContract(ContractRequest request, MultipartFile[] documents) {
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new PropertyNotFoundException(request.propertyId().toString()));

        if (property.getStatus() == PropertyStatus.OCUPADO) {
            log.error("Inmueble con ID: {} ya está ocupado", request.propertyId());
            throw new PropertyUnavailableException("Inmueble con ID: " + request.propertyId() + " ya está ocupado");
        }

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        Contract contract = contractMapper.toEntity(request, property, tenant);
        contract.setTenant(tenant);
        contract.setActive(true);

        property.setStatus(PropertyStatus.OCUPADO);
        propertyRepository.save(property);

        // Guardar contrato para obtener ID
        contract = contractRepository.save(contract);

        // Procesar documentos si los hay
        if (documents != null && documents.length > 0) {
            try {
                String contractNumber = "CONT-" + contract.getContractId();
                List<FileUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        FileUploadService.EntityType.CONTRACT,
                        contract.getContractId().toString(),
                        contractNumber
                );

                Set<AttachedDocument> attachedDocs = new HashSet<>();
                for (FileUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();

                    attachedDocs.add(doc);
                }

                contract.setDocuments(attachedDocs);
                contract = contractRepository.save(contract);

            } catch (Exception e) {
                log.error("Error al subir documentos del contrato: {}", e.getMessage());
                throw new FileUploadException("Error al subir documentos: " + e.getMessage());
            }
        }

        log.info("Contrato creado exitosamente para propiedad ID: {} y inquilino ID: {}, con {} documentos",
                request.propertyId(), request.tenantId(), contract.getDocuments().size());

        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse getContractById(Long id) {
        return contractRepository.findById(id)
                .map(contractMapper::toResponse)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));
    }

    @Override
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable)
                .map(contractMapper::toResponse);
    }

    @Override
    @Transactional
    public ContractResponse updateContract(Long id, ContractRequest request, MultipartFile[] documents) {
        Contract existing = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));

        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new PropertyNotFoundException(request.propertyId().toString()));

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        Contract updated = contractMapper.toEntity(request, property, tenant);
        updated.setContractId(id);

        // Mantener los documentos existentes
        updated.setDocuments(existing.getDocuments());

        // Añadir nuevos documentos si existen
        if (documents != null && documents.length > 0) {
            try {
                String contractNumber = "CONT-" + updated.getContractId();
                List<FileUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        FileUploadService.EntityType.CONTRACT,
                        updated.getContractId().toString(),
                        contractNumber
                );

                for (FileUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();

                    updated.getDocuments().add(doc);
                }

            } catch (Exception e) {
                log.error("Error al actualizar documentos: {}", e.getMessage());
                throw new FileUploadException("Error al actualizar documentos: " + e.getMessage());
            }
        }

        log.info("Contrato actualizado: ID {} con {} documentos", id, updated.getDocuments().size());

        return contractMapper.toResponse(contractRepository.save(updated));
    }

    @Override
    @Transactional
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));

        // Eliminar documentos de Cloudinary
        List<String> publicIds = new ArrayList<>();
        for (AttachedDocument doc : contract.getDocuments()) {
            if (doc.getPublicId() != null && !doc.getPublicId().isEmpty()) {
                publicIds.add(doc.getPublicId());
            }
        }

        if (!publicIds.isEmpty()) {
            try {
                fileUploadService.deleteMultipleFiles(publicIds);
            } catch (Exception e) {
                log.warn("Error al eliminar algunos documentos de Cloudinary: {}", e.getMessage());
            }
        }

        // Actualizar estado de la propiedad
        Property property = contract.getProperty();
        property.setStatus(PropertyStatus.DISPONIBLE);
        propertyRepository.save(property);

        contractRepository.deleteById(id);
        log.info("Contrato eliminado: ID {}", id);
    }

    @Override
    @Transactional
    public void removeContractDocument(Long contractId, String documentPublicId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNorFoundException(contractId.toString()));

        AttachedDocument docToRemove = null;
        for (AttachedDocument doc : contract.getDocuments()) {
            if (doc.getPublicId().equals(documentPublicId)) {
                docToRemove = doc;
                break;
            }
        }

        if (docToRemove != null) {
            contract.getDocuments().remove(docToRemove);
            contractRepository.save(contract);

            try {
                fileUploadService.deleteFile(documentPublicId);
                log.info("Documento eliminado del contrato ID: {}", contractId);
            } catch (Exception e) {
                log.warn("Error al eliminar documento de Cloudinary: {}", e.getMessage());
            }
        }
    }
}