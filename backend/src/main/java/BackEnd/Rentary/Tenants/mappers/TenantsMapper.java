package BackEnd.Rentary.Tenants.mappers;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TenantsMapper {

    public Tenants toEntity(TenantsRequestDto dto) {
        Tenants tenant = new Tenants();
        tenant.setName(dto.getFirstName());
        tenant.setLastName(dto.getLastName());
        tenant.setEmail(dto.getEmail());
        tenant.setPhone(dto.getPhone());
        tenant.setDni(dto.getDni());
        tenant.setWarranty(dto.getWarranty());

        Address address = new Address();
        address.setCountry(dto.getCountry());
        address.setProvince(dto.getProvince());
        address.setLocality(dto.getLocality());
        address.setStreet(dto.getStreet());
        address.setNumber(dto.getNumber());
        address.setPostalCode(dto.getPostalCode());

        tenant.setAddress(address);

        return tenant;
    }

    public TenantsResponseDto toDto(Tenants entity) {
        TenantsResponseDto dto = new TenantsResponseDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getName());
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
