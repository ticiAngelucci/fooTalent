package BackEnd.Rentary.BCRA.Service;

import BackEnd.Rentary.BCRA.DTO.BcraResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class BcraApiService {

    private final WebClient webClient;

    public BcraApiService(@Qualifier("bcraWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<BcraResponse> fetchData() {
        return webClient.get()
                .uri("/estadisticas/v3.0/Monetarias/40")
                .retrieve()
                .bodyToMono(BcraResponse.class);
    }

    public Double getCurrentIclValueBlocking() {
        return fetchData()
                .map(response -> response.results().isEmpty() ? null : response.results().get(0).value())
                .block(); //
    }

}