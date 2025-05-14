package BackEnd.Rentary.Payments.DTOs;

import java.util.List;

public record PaymentDetailedResponsePage(
        List<PaymentDetailedResponse> dto,
        int page ,
        long size
) {
}
