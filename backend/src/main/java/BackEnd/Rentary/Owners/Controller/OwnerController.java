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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerServiceImpl ownerService;

    @Operation(summary = "Obtener todos los propietarios", description = "Lista paginada de 15 valores por página de los propietarios registrados")
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
    @PostMapping("/create")
    public ResponseEntity<?> createOwner(@RequestBody @Valid OwnerRequestDto ownerDto){

        return ownerService.createOwner(ownerDto);
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
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOwner(@PathVariable Long id, @RequestBody @Valid OwnerRequestDto ownerDto){

        return ownerService.updateOwner(id, ownerDto );
    }

    @Operation(summary = "Obtener todos los inmuebles de un propietario")
    @GetMapping("/{id}/properties")
    public ResponseEntity<List<PropertyResponseDto>> getPropertiesByOwner(@PathVariable Long id){
        List<PropertyResponseDto> properties = ownerService.getPropertiesByOwnerId(id);
        return ResponseEntity.ok(properties);
    }
}
