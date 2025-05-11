package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IContractService {
    ContractResponse createContract(ContractRequest request);
    ContractResponse getContractById(Long id);
    Page<ContractResponse> getAllContracts(Pageable pageable);
    ContractResponse updateContract(Long id, ContractRequest request);
    void deleteContract(Long id);
}
