package BackEnd.Rentary.Config;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import javax.net.ssl.TrustManagerFactory;
import java.io.InputStream;
import java.security.KeyStore;


@Configuration
public class WebClientConfig {

    @Value("${bcra.api.key}")
    private String apiKey;

    @Value("${bcra.url}")
    private String bcraUrl;

    @Bean
    public WebClient bcraWebClient() throws Exception {
        KeyStore trustStore = KeyStore.getInstance("JKS");
        try (InputStream trustStream = getClass().getResourceAsStream("/bcra-truststore.jks")) {
            trustStore.load(trustStream, "changeit".toCharArray());
        }

        TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(trustStore);

        SslContext sslContext = SslContextBuilder.forClient()
                .trustManager(tmf)
                .build();

        HttpClient httpClient = HttpClient.create()
                .secure(t -> t.sslContext(sslContext));

        return WebClient.builder()
                .baseUrl(bcraUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}

