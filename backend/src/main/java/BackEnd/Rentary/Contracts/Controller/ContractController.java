package BackEnd.Rentary.Contracts.Controller;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Service.ContractServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contract")
@RequiredArgsConstructor
public class ContractController {

    private final ContractServiceImpl contractService;

    @PostMapping("/create")
    public ContractResponse createContract(@Valid @RequestBody ContractRequest contractRequest){
        return contractService.createContract(contractRequest);
    }

    @GetMapping("/{id}")
    public ContractResponse getContractById(@PathVariable Long id){
        return contractService.getContractById(id);
    }

    @GetMapping("/all")
    public Page<ContractResponse> getAllContracts(@PageableDefault(size = 15) Pageable pageable){
        return contractService.getAllContracts(pageable);
    }

    @PatchMapping("/{id}")
    public ContractResponse updateContract(@Valid @PathVariable Long id, @RequestBody ContractRequest contractRequest){
        return contractService.updateContract(id, contractRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteContract(@PathVariable Long id){
        contractService.deleteContract(id);
    }
}
