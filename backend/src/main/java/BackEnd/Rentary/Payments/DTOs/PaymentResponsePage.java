package BackEnd.Rentary.Payments.DTOs;

import java.util.List;

public record PaymentResponsePage(
        List<PaymentResponse> dto,
        int page,
        long size

) {
}
