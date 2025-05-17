package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import BackEnd.Rentary.Common.Service.FileUploadService;
import BackEnd.Rentary.Exceptions.DuplicateDniException;
import BackEnd.Rentary.Exceptions.FileUploadException;
import BackEnd.Rentary.Exceptions.OwnerHasActivePropertyException;
import BackEnd.Rentary.Exceptions.OwnerNotFoundException;
import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Owners.Mapper.OwnerMapper;
import BackEnd.Rentary.Owners.Repositories.OwnerRepository;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import BackEnd.Rentary.Properties.Mapper.PropertyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerServiceImpl implements OwnerService {

    private final OwnerRepository ownerRepository;
    private final OwnerMapper ownerMapper;
    private final PropertyMapper propertyMapper;
    private final FileUploadService fileUploadService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    public ResponseEntity<?> getOwnerId(Long id) {
        String email = getCurrentUserEmail();

        Owner owner = ownerRepository.findByIdAndCreatedBy(id, email)
                .orElseThrow(() -> new OwnerNotFoundException("No se encontró propietario con ID: " + id));

        OwnerResponseDto ownerDto = ownerMapper.toDto(owner);
        return ResponseEntity.ok().body(ownerDto);
    }

    @Override
    @Transactional
    public void createOwner(OwnerRequestDto ownerDto, MultipartFile[] documents) {
        if (ownerRepository.existsByDni(ownerDto.dni())) {
            throw new DuplicateDniException("Ya existe un propietario con DNI: " + ownerDto.dni());
        }

        Owner owner = ownerMapper.toEntity(ownerDto);
        owner.setCreatedBy(getCurrentUserEmail());  // <--- Se setea el createdBy al crear

        owner = ownerRepository.save(owner);

        if (documents != null && documents.length > 0) {
            try {
                String ownerCode = "OWN-" + owner.getId();
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.OWNER,
                        owner.getId().toString(),
                        ownerCode
                );

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

                owner.setDocuments(attachedDocs);
                ownerRepository.save(owner);

            } catch (Exception e) {
                throw new FileUploadException("Error al subir documentos del propietario: " + e.getMessage());
            }
        }
    }

    @Override
    public void deleteOwner(Long id) {
        String email = getCurrentUserEmail();

        Owner owner = ownerRepository.findByIdAndCreatedBy(id, email)
                .orElseThrow(() -> new OwnerNotFoundException(id.toString()));

        boolean hasActiveProperty = owner.getProperties().stream()
                .anyMatch(property -> property.getStatus() == PropertyStatus.OCUPADO);

        if (hasActiveProperty) {
            throw new OwnerHasActivePropertyException("El propietario tiene propiedades activas y no puede ser eliminado.");
        }

        ownerRepository.delete(owner);
    }

    @Override
    @Transactional
    @CacheEvict(value = "owner", key = "#id")
    public OwnerResponseDto updateOwner(Long id, OwnerRequestDto dto, MultipartFile[] documents) {
        String email = getCurrentUserEmail();

        Owner existingOwner = ownerRepository.findByIdAndCreatedBy(id, email)
                .orElseThrow(() -> new OwnerNotFoundException(id.toString()));

        if (!existingOwner.getDni().equals(dto.dni()) &&
                ownerRepository.existsByDni(dto.dni())) {
            throw new DuplicateDniException("Ya existe otro propietario con DNI: " + dto.dni());
        }

        existingOwner.setFirstName(dto.firstName());
        existingOwner.setLastName(dto.lastName());
        existingOwner.setEmail(dto.email());
        existingOwner.setPhone(dto.phone());
        existingOwner.setDni(dto.dni());

        if (existingOwner.getAddress() != null) {
            existingOwner.getAddress().setCountry(dto.address().getCountry());
            existingOwner.getAddress().setProvince(dto.address().getProvince());
            existingOwner.getAddress().setLocality(dto.address().getLocality());
            existingOwner.getAddress().setStreet(dto.address().getStreet());
            existingOwner.getAddress().setNumber(dto.address().getNumber());
            existingOwner.getAddress().setPostalCode(dto.address().getPostalCode());
        }

        if (documents != null && documents.length > 0) {
            try {
                List<DocumentUploadResult> results = fileUploadService.uploadMultipleFiles(
                        documents,
                        EntityType.OWNER,
                        existingOwner.getId().toString(),
                        existingOwner.getDni());

                for (DocumentUploadResult result : results) {
                    AttachedDocument doc = AttachedDocument.builder()
                            .url(result.getUrl())
                            .publicId(result.getPublicId())
                            .originalName(result.getOriginalName())
                            .fileType(result.getFileType())
                            .extension(result.getExtension())
                            .build();

                    existingOwner.getDocuments().add(doc);
                }

            } catch (Exception e) {
                throw new FileUploadException("Error al actualizar documentos del propietario: " + e.getMessage());
            }
        }

        Owner updatedOwner = ownerRepository.save(existingOwner);
        return ownerMapper.toDto(updatedOwner);
    }

    @Override
    public Page<OwnerResponseDto> getOwner(Pageable pageable) {
        String email = getCurrentUserEmail();

        return ownerRepository.findAllByCreatedBy(email, pageable)
                .map(ownerMapper::toDto);
    }

    @Override
    public List<PropertyResponseDto> getPropertiesByOwnerId(Long id) {
        String email = getCurrentUserEmail();

        Owner owner = ownerRepository.findByIdAndCreatedBy(id, email)
                .orElseThrow(() -> new OwnerNotFoundException(id.toString()));

        return owner.getProperties().stream()
                .map(propertyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PropertyResponseDto> getAvailablePropertiesByOwnerId(Long id) {
        String email = getCurrentUserEmail();

        Owner owner = ownerRepository.findByIdAndCreatedBy(id, email)
                .orElseThrow(() -> new OwnerNotFoundException(id.toString()));

        return owner.getProperties().stream()
                .filter(property -> property.getStatus() == PropertyStatus.DISPONIBLE)
                .map(propertyMapper::toDto)
                .collect(Collectors.toList());
    }
}