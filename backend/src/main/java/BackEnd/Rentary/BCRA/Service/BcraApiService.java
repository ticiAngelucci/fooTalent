package BackEnd.Rentary.BCRA.Service;

import BackEnd.Rentary.BCRA.DTO.BcraResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class BcraApiService {

    private final WebClient webClient;

    public BcraApiService(WebClient.Builder webClientBuilder,
                          @Value("${bcra.api.key}") String apiKey,
                          @Value("${bcra.url}") String bcraUrl) {
        this.webClient = webClientBuilder
                .baseUrl(bcraUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public Mono<BcraResponse> fetchData() {
        return webClient.get()
                .uri("/estadisticas/v3.0/Monetarias/40")
                .retrieve()
                .bodyToMono(BcraResponse.class);
    }
}
