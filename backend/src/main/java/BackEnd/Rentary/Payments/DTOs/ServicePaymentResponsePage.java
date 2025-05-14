package BackEnd.Rentary.Payments.DTOs;

import java.util.List;

public record ServicePaymentResponsePage(
        List<ServicePaymentResponse> dto,
        int page,
        long size
) {
}