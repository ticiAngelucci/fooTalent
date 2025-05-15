package BackEnd.Rentary.Contracts.Mapper;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ContractMapper {

    public Contract toEntity(ContractRequest request, Property property, Tenants tenants) {
        Contract contract = new Contract();
        contract.setProperty(property);
        contract.setTenant(tenants);
        contract.setStartDate(request.startDate());
        contract.setEndDate(request.endDate());
        contract.setBaseRent(request.baseRent());
        contract.setDeposit(request.deposit());
        contract.setAdjustmentFrequency(request.adjustmentFrequency());
        contract.setDeadline(request.deadline());
        contract.setAdjustmentPercentage(request.adjustmentPercentage());
        contract.setAdjustmentType(request.adjustmentType());
        return contract;
    }

    public ContractResponse toResponse(Contract contract) {
        List<DocumentDto> documentDtos = contract.getDocuments() != null ?
                contract.getDocuments().stream()
                        .map(doc -> new DocumentDto(
                                doc.getId(),
                                doc.getUrl(),
                                doc.getPublicId(),
                                doc.getOriginalName(),
                                doc.getFileType(),
                                doc.getExtension()
                        ))
                        .collect(Collectors.toList()) :
                new ArrayList<>();

        Property p = contract.getProperty();
        String propertyAddress = String.format("%s %s, %s, %s",
                p.getAddress().getStreet(),
                p.getAddress().getNumber(),
                p.getAddress().getLocality(),
                p.getAddress().getProvince());

        Tenants t = contract.getTenant();
        String tenantFullName = t.getFirstName() + " " + t.getLastName();
        Owner o = contract.getProperty().getOwner();
        String ownerFullName = o.getFirstName() + " " + o.getLastName();

        return new ContractResponse(
                contract.getContractId(),
                contract.getProperty().getId_property(),
                contract.getTenant().getId(),
                contract.getProperty().getOwner().getId(),
                ownerFullName,
                propertyAddress,
                tenantFullName,
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getBaseRent(),
                contract.getDeposit(),
                contract.getAdjustmentFrequency(),
                contract.getDeadline(),
                contract.isActive(),
                contract.getAdjustmentPercentage(),
                AdjustmentType.getLabel(contract.getAdjustmentType()),
                documentDtos
        );
    }

    public void updateEntity(Contract existing, ContractRequest request, Property property, Tenants tenants) {
        existing.setProperty(property);
        existing.setTenant(tenants);
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setBaseRent(request.baseRent());
        existing.setDeposit(request.deposit());
        existing.setAdjustmentFrequency(request.adjustmentFrequency());
        existing.setDeadline(request.deadline());
        existing.setAdjustmentPercentage(request.adjustmentPercentage());
        existing.setAdjustmentType(request.adjustmentType());
    }
}
