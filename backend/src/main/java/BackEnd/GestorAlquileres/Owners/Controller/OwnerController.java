package BackEnd.GestorAlquileres.Owners.Controller;

import BackEnd.GestorAlquileres.Owners.DTOs.OwnerDto;
import BackEnd.GestorAlquileres.Owners.Services.OwnerServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    private OwnerServiceImpl ownerService;

    public OwnerController(OwnerServiceImpl ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping("/")
    public ResponseEntity<?> getOwner(){

        return ResponseEntity.ok(ownerService.getOwner());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOwnerId(@PathVariable Long id){

        return ownerService.getOwnerId(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOwner(@RequestBody @Valid OwnerDto ownerDto){

        return ownerService.createOwner(ownerDto);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteOwner(@PathVariable Long id){

        return ownerService.deleteOwner(id);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateOwner(@PathVariable Long id, @RequestBody @Valid OwnerDto ownerDto){

        return ownerService.updateOwner(id, ownerDto );
    }

}
