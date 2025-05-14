package BackEnd.Rentary.Payments.Mapper;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Payments.DTOs.ContractSummary;
import BackEnd.Rentary.Payments.DTOs.PaymentResponse;
import BackEnd.Rentary.Payments.DTOs.PaymentSummaryResponse;
import BackEnd.Rentary.Payments.Entities.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        Contract contract = payment.getContract();
        String propertyAddress = contract.getProperty().getAddress().toString();
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
                .propertyAddress(propertyAddress)
                .tenantName(tenantName)
                .build();
    }

    public ContractSummary getContractInfo(Contract contract) {
        return new ContractSummary(
                contract.getContractId(),
                contract.getProperty().getAddress().toString(),
                contract.getTenant().getFirstName() + " " + contract.getTenant().getLastName()
        );
    }
}