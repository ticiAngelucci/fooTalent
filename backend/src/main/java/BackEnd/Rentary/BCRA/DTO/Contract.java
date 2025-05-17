package BackEnd.Rentary.BCRA.DTO;

import java.time.LocalDate;

public record Contract(
        double rentBase,
        LocalDate startDate,
        int monthsBetweenSettings
) {}