package BackEnd.Rentary.BCRA.Controller;


import BackEnd.Rentary.BCRA.DTO.BcraResponse;
import BackEnd.Rentary.BCRA.DTO.BcraResult;
import BackEnd.Rentary.BCRA.Service.BcraApiService;
import BackEnd.Rentary.BCRA.Service.RentUpdateService;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import static BackEnd.Rentary.BCRA.Util.Calcs.calculateAdjustedRent;



@RestController
@RequestMapping("/bcra")
public class BcraController {

    private final BcraApiService bcraApiService;
    private final IContractRepository contractRepository;
    private final RentUpdateService rentUpdateService;

    public BcraController(BcraApiService bcraApiService, IContractRepository contractRepository, RentUpdateService rentUpdateService) {
        this.bcraApiService = bcraApiService;
        this.contractRepository = contractRepository;
        this.rentUpdateService = rentUpdateService;
    }

    @GetMapping("/data")
    public Mono<BcraResponse> getData() {
        return bcraApiService.fetchData();
    }

    @GetMapping("/last")
    public Mono<BcraResult> getLastData() {
        return bcraApiService.fetchData()
                .map(response -> response.results().isEmpty() ? null : response.results().get(0));
    }

    @GetMapping("/rental-adjustment")
    public Mono<Double> getRentalAdjustment(@RequestParam Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato no encontrado"));

        if (contract.getAdjustmentType() == AdjustmentType.ICL) {
            return bcraApiService.fetchData()
                    .map(response -> response.results().stream()
                            .findFirst()
                            .orElseThrow(() -> new IllegalStateException("No se encontró valor ICL actual"))
                    )
                    .map(icl -> {
                        double newRent = calculateAdjustedRent(contract, icl.value());
                        contract.setCurrentRent(newRent);
                        return contractRepository.save(contract).getCurrentRent();
                    });
        } else {
            double newRent = calculateAdjustedRent(contract, 0.0);
            contract.setCurrentRent(newRent);
            contractRepository.save(contract);
            return Mono.just(newRent);
        }
    }
    @PostMapping("/trigger-rent-update")
    public ResponseEntity<String> triggerRentUpdate() {
        rentUpdateService.updateCurrentRentAndPayments();
        return ResponseEntity.ok("Actualización de rentas y pagos ejecutada manualmente.");
    }
}




