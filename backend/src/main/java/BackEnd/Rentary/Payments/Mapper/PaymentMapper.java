package BackEnd.Rentary.Payments.Mapper;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Payments.DTOs.ContractSummary;
import BackEnd.Rentary.Payments.DTOs.PaymentDetailedResponse;
import BackEnd.Rentary.Payments.DTOs.PaymentRentalResponseDto;
import BackEnd.Rentary.Payments.DTOs.PaymentResponse;
import BackEnd.Rentary.Payments.DTOs.ServicePaymentResponse;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        Contract contract = payment.getContract();
        String tenantName = contract.getTenant().getFirstName() + " " + contract.getTenant().getLastName();

        return PaymentResponse.builder()
                .id(payment.getId())
                .contractId(contract.getContractId())
                .amount(payment.getAmount())
                .dueDate(payment.getDueDate())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .currency(payment.getCurrency())
                .description(payment.getDescription())
                .serviceType(payment.getServiceType())
                .period(payment.getPeriod())
                .year(payment.getYear())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .isOverdue(payment.isOverdue())
                .tenantName(tenantName)
                .build();
    }

    public ServicePaymentResponse toServiceResponse(Payment payment) {
        return ServicePaymentResponse.builder()
                .id(payment.getId())
                .serviceType(payment.getServiceType())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .build();
    }

    public PaymentRentalResponseDto toRentalResponse(Payment payment) {
        return PaymentRentalResponseDto.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .status(payment.getStatus())
                .build();
    }

    public PaymentDetailedResponse toDetailedResponse(Payment payment) {
        Contract contract = payment.getContract();
        Tenants tenant = contract.getTenant();

        String streetAndNumber = tenant.getAddress().getStreet() + " " + tenant.getAddress().getNumber();
        String locality = tenant.getAddress().getLocality();
        String province = tenant.getAddress().getProvince();
        String fullAddress = streetAndNumber + ", " + locality + ", " + province;

        String tenantName = tenant.getFirstName() + " " + tenant.getLastName();

        return PaymentDetailedResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .propertyAddress(fullAddress)
                .tenantName(tenantName)
                .adjustmentFrequency(contract.getAdjustmentFrequency())
                .deadline(contract.getDeadline())
                .build();
    }

}