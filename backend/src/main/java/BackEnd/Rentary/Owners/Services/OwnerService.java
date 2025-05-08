package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerDto;
import BackEnd.Rentary.Propertys.DTOs.CustomPageResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface OwnerService {
    ResponseEntity<?> getOwnerId(Long id);
    ResponseEntity<?> createOwner(OwnerDto owner);
    ResponseEntity<?> deleteOwner(Long id);
    ResponseEntity<?> updateOwner(Long id, OwnerDto owner);
    CustomPageResponse<OwnerDto> getOwner(Pageable pageable);
}
