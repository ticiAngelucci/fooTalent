package BackEnd.Rentary.Propertys.Controller;

import BackEnd.Rentary.Auth.DTOs.CustomUserDetails;
import BackEnd.Rentary.Propertys.DTOs.CustomPageResponse;
import BackEnd.Rentary.Propertys.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Propertys.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import BackEnd.Rentary.Propertys.Service.PropertyServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyServiceImpl propertyService;

    @PostMapping("/create")
    public ResponseEntity<PropertyResponseDto> createProperty(@Valid @RequestBody PropertyRequestDto dto,
                                                              @AuthenticationPrincipal CustomUserDetails user){
        Long userId = user.user().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.createProperty(dto, userId));
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long propertyId){
        propertyService.deleteProperty(propertyId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{propertyId}")
    public ResponseEntity<PropertyResponseDto> changePropertyStatus(@PathVariable Long propertyId,
                                                                    @RequestParam PropertyStatus newStatus){
        return ResponseEntity.ok(propertyService.changePropertyStatus(propertyId, newStatus));
    }

    @GetMapping("/available")
    public ResponseEntity<CustomPageResponse<PropertyResponseDto>> getAvailableProperties(
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) TypeOfProperty type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "id_property") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.fromString(direction), sortBy);
        Page<PropertyResponseDto> result = propertyService.getAllActivePropertiesFiltered(locality, type, pageable);

        CustomPageResponse<PropertyResponseDto> response = new CustomPageResponse<>(
                result.getContent(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.getNumber()
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<PropertyResponseDto> updateProperty(
            @PathVariable Long id,
            @RequestBody @Valid PropertyRequestDto dto) {

        PropertyResponseDto updatedProperty = propertyService.updateProperty(id, dto);
        return ResponseEntity.ok(updatedProperty);
    }

    @GetMapping("/all")
    public Page<PropertyResponseDto> getAllProperties(@PageableDefault(size = 15) Pageable pageable){
        return propertyService.getAllProperties(pageable);
    }
}
