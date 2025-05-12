package BackEnd.Rentary.Contracts.Mapper;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Tenants.entities.Tenants;
import org.springframework.stereotype.Component;

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
        return contract;
    }

    public ContractResponse toDto(Contract contract) {
        return new ContractResponse(
                contract.getContractId(),
                contract.getProperty().getId_property(),
                contract.getTenant().getId(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getBaseRent(),
                contract.getDeposit(),
                contract.getAdjustmentFrequency(),
                contract.getDeadline(),
                contract.isActive(),
                contract.getAdjustmentPercentage()
        );
    }
}
