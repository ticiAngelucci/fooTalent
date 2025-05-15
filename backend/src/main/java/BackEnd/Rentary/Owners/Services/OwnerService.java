package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Entities.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface OwnerService {
    ResponseEntity<?> getOwnerId(Long id);
    ResponseEntity<?> createOwner(OwnerRequestDto ownerDto);
    ResponseEntity<?> deleteOwner(Long id);
    ResponseEntity<?> updateOwner(Long id, OwnerRequestDto ownerDto);
    Page<OwnerResponseDto> getOwner(Pageable pageable);
    List<PropertyResponseDto> getPropertiesByOwnerId(Long id);
}
