package BackEnd.Rentary.BCRA.Controller;


import BackEnd.Rentary.BCRA.DTO.BcraResponse;
import BackEnd.Rentary.BCRA.DTO.BcraResult;
import BackEnd.Rentary.BCRA.Service.BcraApiService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import java.time.LocalDate;
import static BackEnd.Rentary.BCRA.Util.Calcs.calculateAdjustedRent;
import static BackEnd.Rentary.BCRA.Util.Calcs.shouldAdjust;


@RestController
@RequestMapping("/bcra")
public class BcraController {

    private final BcraApiService bcraApiService;

    public BcraController(BcraApiService bcraApiService) {
        this.bcraApiService = bcraApiService;
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
    public Mono<Double> getRentalAdjustment(
            @RequestParam double baseRent,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam int monthsBetweenAdjustments) {

        LocalDate today = LocalDate.now();

        if (!shouldAdjust(startDate, monthsBetweenAdjustments, today)) {
            return Mono.just(baseRent); // Not time to adjust yet
        }

        return bcraApiService.fetchData()
                .map(response -> response.results().isEmpty() ? null : response.results().get(0))
                .map(icl -> calculateAdjustedRent(baseRent, icl.value()));
    }
}


