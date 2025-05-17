package BackEnd.Rentary.Contracts.Enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AdjustmentType {
    ICL("ICL"),
    FIJO("% Fijo");
    private final String adjustmentType;

    public static String getLabel(AdjustmentType type) {
        return type != null ? type.getAdjustmentType() : null;
    }
}
