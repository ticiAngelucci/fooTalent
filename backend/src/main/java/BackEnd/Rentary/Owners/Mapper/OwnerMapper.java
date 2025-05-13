package BackEnd.Rentary.Owners.Mapper;

import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Entities.Owner;
import org.springframework.stereotype.Component;

@Component
public class OwnerMapper {

    public Owner toEntity(OwnerRequestDto request) {
        Owner owner = new Owner();
        owner.setFirstName(request.firstName());
        owner.setLastName(request.lastName());
        owner.setDni(request.dni());
        owner.setEmail(request.email());
        owner.setPhone(request.phone());
        owner.setAddress(request.address());
        owner.setAttachedDocument(request.attachedDocument());
        return owner;
    }

    public OwnerResponseDto toDto(Owner owner) {
        return new OwnerResponseDto(
                owner.getId(),
                owner.getFirstName(),
                owner.getLastName(),
                owner.getDni(),
                owner.getEmail(),
                owner.getPhone(),
                owner.getAddress(),
                owner.getAttachedDocument()
        );
    }
}
