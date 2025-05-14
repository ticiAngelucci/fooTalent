package BackEnd.Rentary.Payments.DTOs;

import java.util.List;

public record PaymentRentalResponsePage(
        List<PaymentRentalResponseDto> dto,
        int page,
        long size
) {
}
