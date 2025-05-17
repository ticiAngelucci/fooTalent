package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface IContractService {
    ContractResponse createContract(ContractRequest request, MultipartFile[] documents);
    ContractResponse getContractById(Long id);
    Page<ContractResponse> getAllContracts(Pageable pageable);
    ContractResponse updateContract(Long id, ContractRequest request, MultipartFile[] documents);
    void deleteContract(Long id);
    void removeContractDocumentById(Long contractId, String documentId);
    void finalizeContract(Long id);
}