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
    void createOwnerAndCreatedBy(OwnerRequestDto ownerDto, MultipartFile[] documents);
    void deleteOwnerAndCreatedBy(Long id);
    OwnerResponseDto updateOwnerAndCreatedBy(Long id, OwnerRequestDto dto, MultipartFile[] documents);
    Page<OwnerResponseDto> getOwner(Pageable pageable);
    List<PropertyResponseDto> getPropertiesByOwnerIdAndCreatedBy(Long id);
    List<PropertyResponseDto> getAvailablePropertiesByOwnerIdAndCreatedBy(Long id);
}
