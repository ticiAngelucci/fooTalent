package BackEnd.Rentary.Owners.Mapper;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class OwnerMapper {

    public Owner toEntity(OwnerRequestDto request) {
        if(request.address() == null) {
            throw new IllegalArgumentException("La dirección es obligatoria.");
        }

        Owner owner = new Owner();
        owner.setFirstName(request.firstName());
        owner.setLastName(request.lastName());
        owner.setDni(request.dni());
        owner.setEmail(request.email());
        owner.setPhone(request.phone());
        owner.setAddress(request.address());
        return owner;
    }

    public OwnerResponseDto toDto(Owner owner) {
        Set<DocumentDto> documents = owner.getDocuments().stream()
                .map(doc -> DocumentDto.builder()
                        .id(doc.getId())
                        .url(doc.getUrl())
                        .publicId(doc.getPublicId())
                        .originalName(doc.getOriginalName())
                        .fileType(doc.getFileType())
                        .extension(doc.getExtension())
                        .build())
                .collect(Collectors.toSet());

        return new OwnerResponseDto(
                owner.getId(),
                owner.getFirstName(),
                owner.getLastName(),
                owner.getDni(),
                owner.getEmail(),
                owner.getPhone(),
                owner.getAddress(),
                documents
        );
    }

}
