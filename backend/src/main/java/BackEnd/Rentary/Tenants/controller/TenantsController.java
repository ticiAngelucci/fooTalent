package BackEnd.Rentary.Tenants.controller;

import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.services.TenantsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tenants")
@Validated
@Slf4j
public class TenantsController {
    private final TenantsService tenantsService;

    @GetMapping("")
    public ResponseEntity<TenantsPageResponseDto> getAllTenants(
            @RequestParam(defaultValue = "0") @Min(value = 0, message = "La página debe ser 0 o mayor") int page,
            @RequestParam(defaultValue = "10") @Min(value = 1, message = "El tamaño debe ser 1 o mayor") int size) {
        var response = tenantsService.findAllTenants(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantsResponseDto> getTenantsById(@PathVariable Long id) {
        TenantsResponseDto tenant = tenantsService.findTenantsById(id);
        return ResponseEntity.ok(tenant);
    }


    @Operation(
            summary = "Crear un nuevo inquilino",
            description = "Crea un nuevo inquilino con la posibilidad de adjuntar un documento PDF"
    )
    @PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<TenantsResponseDto> create(
            @RequestPart("tenant") @Valid TenantsRequestDto tenantData,
            @RequestPart(value = "document", required = false) MultipartFile document) {

        log.info("Creando nuevo inquilino: {}", tenantData.getFirstName());
        if (document != null) {
            log.info("Con documento adjunto: nombre={}, tamaño={}, tipo={}",
                    document.getOriginalFilename(),
                    document.getSize(),
                    document.getContentType());

            log.info("Tipo de archivo: {}", document.getContentType());
        }

        TenantsResponseDto createdTenant = tenantsService.saveTenant(tenantData, document);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }

    @Operation(
            summary = "Actualizar un inquilino existente",
            description = "Actualiza los datos de un inquilino existente, incluyendo la posibilidad de reemplazar su documento PDF"
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TenantsResponseDto> update(
            @PathVariable Long id,
            @RequestPart("tenant") @Valid TenantsRequestDto tenantData,
            @RequestPart(value = "document", required = false) MultipartFile document) {

        log.info("Actualizando inquilino con ID: {}", id);
        TenantsResponseDto updatedTenant = tenantsService.updateTenant(id, tenantData, document);
        return ResponseEntity.ok(updatedTenant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenantsById(@PathVariable Long id) {
        log.info("Eliminando inquilino con ID: {}", id);
        tenantsService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
}