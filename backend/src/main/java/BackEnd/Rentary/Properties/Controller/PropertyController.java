package BackEnd.Rentary.Properties.Controller;

import BackEnd.Rentary.Auth.DTOs.CustomUserDetails;
import BackEnd.Rentary.Exceptions.PropertyHasActiveContractException;
import BackEnd.Rentary.Exceptions.PropertyNotFoundException;
import BackEnd.Rentary.Properties.DTOs.CustomPageResponse;
import BackEnd.Rentary.Properties.DTOs.PropertyRequestDto;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;
import BackEnd.Rentary.Properties.Service.PropertyServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "Crear un inmueble",
            description = "Crear un inmueble que vincula a un propietario")
    @PostMapping("/create")
    public ResponseEntity<PropertyResponseDto> createProperty(@Valid @RequestBody PropertyRequestDto dto,
                                                              @AuthenticationPrincipal CustomUserDetails user){
        Long userId = user.user().getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.createProperty(dto, userId));
    }

    @Operation(summary = "Eliminar un inmueble", description = "Eliminar inmueble pasando un ID")
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long propertyId){
        try {
            propertyService.deleteProperty(propertyId);
            return ResponseEntity.ok("Propiedad eliminada con éxito.");
        } catch (PropertyHasActiveContractException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        } catch (PropertyNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(summary = "Listar inmuebles disponibles")
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

    @Operation(summary = "Editar un inmueble pasado por ID")
    @PatchMapping("/update/{id}")
    public ResponseEntity<PropertyResponseDto> updateProperty(
            @PathVariable Long id,
            @RequestBody @Valid PropertyRequestDto dto) {

        PropertyResponseDto updatedProperty = propertyService.updateProperty(id, dto);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Listar todas los inmuebles", description = "Listar inmuebles paginadas con 15 items por página")
    @GetMapping("/all")
    public Page<PropertyResponseDto> getAllProperties(@PageableDefault(size = 15) Pageable pageable){
        return propertyService.getAllProperties(pageable);
    }

    @Operation(summary = "Obtener inmuebles por un ID")
    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponseDto> getPropertyById(@PathVariable Long id){
        PropertyResponseDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }
}
