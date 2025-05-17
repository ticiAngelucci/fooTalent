package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OwnerService {
    ResponseEntity<?> getOwnerId(Long id);
    void createOwner(OwnerRequestDto ownerDto, MultipartFile[] documents);
    void deleteOwner(Long id);
    OwnerResponseDto updateOwner(Long id, OwnerRequestDto dto, MultipartFile[] documents);
    Page<OwnerResponseDto> getOwner(Pageable pageable);
    List<PropertyResponseDto> getPropertiesByOwnerId(Long id);
    List<PropertyResponseDto> getAvailablePropertiesByOwnerId(Long id);
}
