package BackEnd.Rentary.BCRA.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BcraResult(
        @JsonProperty("fecha") String dates,
        @JsonProperty("valor") double value

) {
}