package BackEnd.Rentary.Contracts.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AdjustmentFrequency {
    TRIMESTRAL("Trimestral", 3),
    CUATRIMESTRAL("Cuatrimestral", 4),
    SEMESTRAL("Semestral", 6);

    private final String monthsString;
    private final int months;
}
