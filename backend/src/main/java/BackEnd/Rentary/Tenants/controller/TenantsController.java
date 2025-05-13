package BackEnd.Rentary.Tenants.controller;

import BackEnd.Rentary.Tenants.DTOs.TenantsPageResponseDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsRequestDto;
import BackEnd.Rentary.Tenants.DTOs.TenantsResponseDto;
import BackEnd.Rentary.Tenants.services.TenantsService;
import io.swagger.v3.oas.annotations.Operation;
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

        @Operation(summary = "Crear un nuevo inquilino", description = "Crea un nuevo inquilino con la posibilidad de adjuntar múltiples documentos (PDF e imágenes)")
        @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
        public ResponseEntity<TenantsResponseDto> create(
                        @RequestPart("tenant") @Valid TenantsRequestDto tenantData,
                        @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

                log.info("Creando nuevo inquilino: {} con {} documentos",
                                tenantData.getFirstName(),
                                documents != null ? documents.length : 0);

                TenantsResponseDto createdTenant = tenantsService.saveTenant(tenantData, documents);
                return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
        }

        @Operation(summary = "Actualizar un inquilino existente", description = "Actualiza los datos de un inquilino existente, incluyendo la posibilidad de añadir nuevos documentos")
        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<TenantsResponseDto> update(
                        @PathVariable Long id,
                        @RequestPart("tenant") @Valid TenantsRequestDto tenantData,
                        @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

                log.info("Actualizando inquilino con ID: {} y añadiendo {} documentos",
                                id, documents != null ? documents.length : 0);

                TenantsResponseDto updatedTenant = tenantsService.updateTenant(id, tenantData, documents);
                return ResponseEntity.ok(updatedTenant);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteTenantsById(@PathVariable Long id) {
                log.info("Eliminando inquilino con ID: {}", id);
                tenantsService.deleteTenant(id);
                return ResponseEntity.noContent().build();
        }

        @Operation(summary = "Eliminar un documento específico de un inquilino", description = "Elimina un documento asociado a un inquilino por su ID")
        @DeleteMapping("/{tenantId}/documents/{documentId}")
        public ResponseEntity<Void> removeTenantDocument(
                        @PathVariable Long tenantId,
                        @PathVariable String documentId) {
                log.info("Eliminando documento {} del inquilino ID: {}", documentId, tenantId);
                tenantsService.removeTenantDocumentById(tenantId, documentId);
                return ResponseEntity.noContent().build();
        }
}