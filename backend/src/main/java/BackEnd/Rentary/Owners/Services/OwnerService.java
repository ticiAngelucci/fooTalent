package BackEnd.Rentary.Owners.Services;

import BackEnd.Rentary.Owners.DTOs.OwnerDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface OwnerService {

    public List<OwnerDto> getOwner();
    public ResponseEntity<?> getOwnerId(Long id);
    public ResponseEntity<?> createOwner(OwnerDto owner);
    public ResponseEntity<?> deleteOwner(Long id);
    public ResponseEntity<?> updateOwner(Long id, OwnerDto owner);

}
