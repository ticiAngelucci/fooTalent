package BackEnd.Rentary.Contracts.Controller;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Service.IContractService;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/contracts")
public class ContractController {

    private final IContractService contractService;

    @Operation(
            summary = "Crear un nuevo contrato",
            description = "Crea un nuevo contrato con la posibilidad de adjuntar múltiples documentos (PDF e imágenes)"
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContractResponse> createContract(
            @RequestPart("contract") @Valid ContractRequest contractRequest,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

        ContractResponse response = contractService.createContract(contractRequest, documents);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable Long id) {
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ContractResponse>> getAllContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ContractResponse> response = contractService.getAllContracts(pageable);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Actualizar un contrato existente",
            description = "Actualiza los datos de un contrato existente, incluyendo la posibilidad de añadir nuevos documentos"
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContractResponse> updateContract(
            @PathVariable Long id,
            @RequestPart("contract") @Valid ContractRequest contractRequest,
            @RequestPart(value = "documents", required = false) MultipartFile[] documents) {

        ContractResponse response = contractService.updateContract(id, contractRequest, documents);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        contractService.deleteContract(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{contractId}/documents/{documentId}")
    public ResponseEntity<Void> removeContractDocument(
            @PathVariable Long contractId,
            @PathVariable String documentId) {
        contractService.removeContractDocumentById(contractId, documentId);
        return ResponseEntity.noContent().build();
    }
}