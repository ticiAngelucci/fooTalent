package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import BackEnd.Rentary.Common.Service.FileUploadService;
import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Mapper.ContractMapper;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.*;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import BackEnd.Rentary.Properties.Repository.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
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
            throw new PropertyUnavailableException("Inmueble con ID: " + request.propertyId() + " ya está ocupado");
        }

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        Contract contract = contractMapper.toEntity(request, property, tenant);
        contract.setTenant(tenant);
        contract.setActive(true);

        property.setStatus(PropertyStatus.OCUPADO);
        propertyRepository.save(property);

        Payment firstPayment = new Payment();
        firstPayment.setContract(contract);
        firstPayment.setAmount(BigDecimal.valueOf(contract.getBaseRent()));
        firstPayment.setDueDate(contract.getStartDate().plusDays(contract.getDeadline()));
        firstPayment.setStatus(PaymentStatus.PENDIENTE);
        firstPayment.setCurrency(Currency.PESOS);
        firstPayment.setPaymentDate(contract.getStartDate().plusDays(contract.getDeadline()));
        firstPayment.setPaymentMethod(PaymentMethod.EFECTIVO);
        firstPayment.setServiceType(ServiceType.ALQUILER);

        contract.getPayments().add(firstPayment);
        contract = contractRepository.save(contract);

        if (documents != null && documents.length > 0) {
            try {
                String contractNumber = "CONT-" + contract.getContractId();
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.CONTRACT,
                        contract.getContractId().toString(),
                        contractNumber);

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

                contract.setDocuments(attachedDocs);
                contract = contractRepository.save(contract);

            } catch (
                    Exception e) {
                throw new FileUploadException("Error al subir documentos: " + e.getMessage());
            }
        }

        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse getContractById(Long id) {
        return contractRepository.findById(id)
                .map(contractMapper::toResponse)
                .orElseThrow(() -> new ContractNotFoundException(id.toString()));
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
                .orElseThrow(() -> new ContractNotFoundException(id.toString()));

        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new PropertyNotFoundException(request.propertyId().toString()));

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        contractMapper.updateEntity(existing, request, property, tenant);

        if (documents != null && documents.length > 0) {
            try {
                String contractNumber = "CONT-" + existing.getContractId();
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.CONTRACT,
                        existing.getContractId().toString(),
                        contractNumber);

                for (DocumentUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();

                    existing.getDocuments().add(doc);
                }

            } catch (Exception e) {
                throw new FileUploadException("Error al actualizar documentos: " + e.getMessage());
            }
        }

        return contractMapper.toResponse(contractRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNotFoundException(id.toString()));

        if (!contract.isActive()) {
            contractRepository.delete(contract);
        }

        if (contract.isActive()) {
            throw new ContractNotExpiredException("El contrato aún está activo y no puede eliminarse.");
        }

        List<String> publicIds = new ArrayList<>();
        for (AttachedDocument doc : contract.getDocuments()) {
            if (doc.getPublicId() != null && !doc.getPublicId().isEmpty()) {
                publicIds.add(doc.getPublicId());
            }
        }

        if (!publicIds.isEmpty()) {
            try {
                fileUploadService.deleteMultipleFiles(publicIds);
            } catch (
                    Exception e) {
                throw new FileUploadException("Error al eliminar algunos documentos de Cloudinary: " + e.getMessage());
            }
        }

        Property property = contract.getProperty();
        property.setStatus(PropertyStatus.DISPONIBLE);
        propertyRepository.save(property);

        contractRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void removeContractDocumentById(Long contractId, String documentId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNotFoundException(contractId.toString()));

        AttachedDocument docToRemove = null;
        for (AttachedDocument doc : contract.getDocuments()) {
            if (doc.getId().equals(documentId)) {
                docToRemove = doc;
                break;
            }
        }

        if (docToRemove != null) {
            // Guardar el publicId para eliminarlo de Cloudinary
            String publicId = docToRemove.getPublicId();

            // Eliminar el documento de la colección
            contract.getDocuments().remove(docToRemove);
            contractRepository.save(contract);

            // Eliminar de Cloudinary
            try {
                fileUploadService.deleteFile(publicId);
                throw new RuntimeException("Documento eliminado del contrato ID" + contractId);
            } catch (
                    Exception e) {
                throw new RuntimeException("Error al eliminar documento de Cloudinary." + e.getMessage());
            }
        }
    }

    @Override
    @Transactional
    public void finalizeContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNotFoundException(id.toString()));

        if (!contract.isActive()) {
            throw new IllegalStateException("El contrato ya está finalizado.");
        }

        Property property = contract.getProperty();
        property.setStatus(PropertyStatus.DISPONIBLE);
        propertyRepository.save(property);

        contract.setActive(false);
        contractRepository.save(contract);
    }
}