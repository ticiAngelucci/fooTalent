package BackEnd.Rentary.BCRA.Util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Calcs {
    public static double calculateAdjustedRent(double baseRent, double icl) {
        return baseRent + baseRent * (icl / 100.0);
    }

    public static boolean shouldAdjust(LocalDate startDate, int monthsBetweenAdjustments, LocalDate today) {
        long monthsElapsed = ChronoUnit.MONTHS.between(startDate, today);
        return monthsElapsed > 0 && monthsElapsed % monthsBetweenAdjustments == 0;
    }
}