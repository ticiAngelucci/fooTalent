package BackEnd.Rentary.Owners.Controller;

import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Services.OwnerServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerServiceImpl ownerService;

    @GetMapping
    public ResponseEntity<Page<OwnerResponseDto>> getOwners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ownerService.getOwner(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOwnerId(@PathVariable Long id){

        return ownerService.getOwnerId(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOwner(@RequestBody @Valid OwnerRequestDto ownerDto){

        return ownerService.createOwner(ownerDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOwner(@PathVariable Long id){

        return ownerService.deleteOwner(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOwner(@PathVariable Long id, @RequestBody @Valid OwnerRequestDto ownerDto){

        return ownerService.updateOwner(id, ownerDto );
    }

}
