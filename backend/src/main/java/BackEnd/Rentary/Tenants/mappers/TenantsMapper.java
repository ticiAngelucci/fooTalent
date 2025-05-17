package BackEnd.Rentary.Tenants.mappers;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TenantsMapper {

    public Tenants toEntity(TenantsRequestDto dto) {
        if (dto.address() == null) {
            throw new IllegalArgumentException("La dirección es obligatoria.");
        }
        Tenants tenant = new Tenants();
        tenant.setFirstName(dto.firstName());
        tenant.setLastName(dto.lastName());
        tenant.setEmail(dto.email());
        tenant.setPhone(dto.phone());
        tenant.setDni(dto.dni());
        tenant.setWarranty(dto.warranty());

        Address address = new Address();
        address.setCountry(dto.address().getCountry());
        address.setProvince(dto.address().getProvince());
        address.setLocality(dto.address().getLocality());
        address.setStreet(dto.address().getStreet());
        address.setNumber(dto.address().getNumber());
        address.setPostalCode(dto.address().getPostalCode());

        tenant.setAddress(address);

        return tenant;
    }

    public TenantsResponseDto toDto(Tenants entity) {
        TenantsResponseDto dto = new TenantsResponseDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setDni(entity.getDni());
        dto.setWarranty(entity.getWarranty());

        if (entity.getDocuments() != null && !entity.getDocuments().isEmpty()) {


            List<DocumentDto> documentDtos = entity.getDocuments().stream()
                    .map(doc -> DocumentDto.builder()
                            .id(doc.getId())
                            .url(doc.getUrl())
                            .publicId(doc.getPublicId())
                            .originalName(doc.getOriginalName())
                            .fileType(doc.getFileType())
                            .extension(doc.getExtension())
                            .build())
                    .collect(Collectors.toList());

            dto.setDocuments(documentDtos);
        } else {
            dto.setDocuments(new ArrayList<>());
        }

        if (entity.getAddress() != null) {
            dto.setCountry(entity.getAddress().getCountry());
            dto.setProvince(entity.getAddress().getProvince());
            dto.setLocality(entity.getAddress().getLocality());
            dto.setStreet(entity.getAddress().getStreet());
            dto.setNumber(entity.getAddress().getNumber());
            dto.setPostalCode(entity.getAddress().getPostalCode());
        }

        return dto;
    }
}
