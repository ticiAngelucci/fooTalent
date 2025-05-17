package BackEnd.Rentary.BCRA.Util;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;


public class Calcs {

    public static double calculateAdjustedRent(Contract contract, Double currentIcl) {
        if (contract.getAdjustmentType() == AdjustmentType.ICL) {
            Double initialIcl = contract.getInitialIcl();
            if (initialIcl == null || currentIcl == null || currentIcl == 0) {
                throw new IllegalStateException("Faltan datos para calcular el ajuste por ICL");
            }

            BigDecimal baseRent = BigDecimal.valueOf(contract.getBaseRent());
            BigDecimal coefficient = BigDecimal.valueOf(currentIcl)
                    .divide(BigDecimal.valueOf(initialIcl), 6, RoundingMode.HALF_UP); // precisión intermedia

            BigDecimal adjustedRent = baseRent.multiply(coefficient)
                    .setScale(0, RoundingMode.HALF_UP); // redondeo final sin decimales

            return adjustedRent.doubleValue();
        } else {
            long months = ChronoUnit.MONTHS.between(contract.getStartDate(), LocalDate.now());
            long periods = months / contract.getAdjustmentFrequency().getMonths();
            return BigDecimal.valueOf(contract.getBaseRent())
                    .multiply(BigDecimal.valueOf(Math.pow(1 + contract.getAdjustmentPercentage() / 100, periods)))
                    .setScale(0, RoundingMode.HALF_UP)
                    .doubleValue();
        }
    }
}