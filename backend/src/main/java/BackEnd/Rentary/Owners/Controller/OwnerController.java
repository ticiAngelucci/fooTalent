package BackEnd.Rentary.Owners.Controller;

import BackEnd.Rentary.Exceptions.OwnerHasActivePropertyException;
import BackEnd.Rentary.Exceptions.OwnerNotFoundException;
import BackEnd.Rentary.Owners.DTOs.OwnerRequestDto;
import BackEnd.Rentary.Owners.DTOs.OwnerResponseDto;
import BackEnd.Rentary.Owners.Services.OwnerServiceImpl;
import BackEnd.Rentary.Properties.DTOs.PropertyResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerServiceImpl ownerService;

    @Operation(summary = "Obtener todos los propietarios",
            description = "Lista paginada de 15 valores por página de los propietarios registrados")
    @GetMapping
    public ResponseEntity<Page<OwnerResponseDto>> getOwners(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ownerService.getOwner(pageable));
    }

    @Operation(summary = "Obtener un propietario por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getOwnerId(@PathVariable Long id){

        return ownerService.getOwnerId(id);
    }

    @Operation(summary = "Registrar un nuevo propietario")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createOwner(
            @RequestPart("owner") @Valid OwnerRequestDto ownerDto,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

        ownerService.createOwner(ownerDto, documents);
        return ResponseEntity.status(HttpStatus.CREATED).body("Propietario creado exitosamente");
    }

    @Operation(summary = "Eliminar un propietario")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteOwner(@PathVariable Long id){
        try {
            ownerService.deleteOwner(id);
            return ResponseEntity.ok("Propietario eliminado con éxito.");
        } catch (OwnerHasActivePropertyException e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        } catch (OwnerNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @Operation(summary = "Actualizar datos de un propietario")
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OwnerResponseDto> updateOwner(
            @PathVariable Long id,
            @RequestPart("owner") @Valid OwnerRequestDto dto,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

        OwnerResponseDto updated = ownerService.updateOwner(id, dto, documents);
        return ResponseEntity.ok(updated);
    }


    @Operation(summary = "Obtener todos los inmuebles de un propietario")
    @GetMapping("/{id}/properties")
    public ResponseEntity<List<PropertyResponseDto>> getPropertiesByOwner(@PathVariable Long id){
        List<PropertyResponseDto> properties = ownerService.getPropertiesByOwnerId(id);
        return ResponseEntity.ok(properties);
    }

    @Operation(summary = "Obtener todos los inmuebles DISPONIBLES de un propietario")
    @GetMapping("/{id}/available-properties")
    public ResponseEntity<List<PropertyResponseDto>> getAvailablePropertiesByOwner(@PathVariable Long id) {
        List<PropertyResponseDto> properties = ownerService.getAvailablePropertiesByOwnerId(id);
        return ResponseEntity.ok(properties);
    }
}
