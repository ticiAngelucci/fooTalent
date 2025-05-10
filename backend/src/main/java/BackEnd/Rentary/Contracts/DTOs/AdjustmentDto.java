package BackEnd.Rentary.Contracts.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdjustmentDto {
    @NotBlank(message = "Campo obligatorio")
    private String monthString;
    private int month;
}
