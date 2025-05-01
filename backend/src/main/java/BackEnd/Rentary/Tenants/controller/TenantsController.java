package BackEnd.Rentary.Tenants.controller;

import BackEnd.Rentary.Tenants.services.TenantsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tenants")
@Validated
public class TenantsController {
    private final TenantsService tenantsService;

    @GetMapping("")
    public ResponseEntity<?> getAllTenants() {
        return ResponseEntity.ok("");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTenantsById(@PathVariable Long id) {
        return ResponseEntity.ok("");
    }

    @PostMapping("")
    public ResponseEntity<?> create() {
        return new ResponseEntity(HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(@PathVariable Long id) {
        return ResponseEntity.ok("");
    }


    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteTenantsById(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

}
