package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Mapper.ContractMapper;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements IContractService {

    private final IContractRepository contractRepository;
    private final PropertyRepository propertyRepository;
    private final TenantsRepository tenantsRepository;
    private final ContractMapper contractMapper;

    @Override
    public ContractResponse createContract(ContractRequest request) {
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inmueble no encontrado."));

        if (property.getStatus() == PropertyStatus.OCUPADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inmueble ocupado.");
        }

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inquilino no encontrado."));

        Contract contract = contractMapper.toEntity(request, property, tenant);
        contract.setTenant(tenant);
        contract.setTenant(tenant);
        contract.setActive(true);

        property.setStatus(PropertyStatus.OCUPADO);
        propertyRepository.save(property);

        contractRepository.save(contract);

        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse getContractById(Long id) {
        return contractRepository.findById(id)
                .map(contractMapper::toResponse)
                .orElseThrow();
    }

    @Override
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable)
                .map(contractMapper::toResponse);
    }

    @Override
    @Transactional
    public ContractResponse updateContract(Long id, ContractRequest request) {
        Contract existing = contractRepository.findById(id).orElseThrow();
        Property property = propertyRepository.findById(request.tenantId()).orElseThrow();
        Tenants tenant = tenantsRepository.findById(request.tenantId()).orElseThrow();
        Contract updated = contractMapper.toEntity(request, property, tenant);
        updated.setContractId(id);
        return contractMapper.toResponse(contractRepository.save(updated));
    }

    @Override
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contrato no encontrado."));

        Property property = contract.getProperty();
        property.setStatus(PropertyStatus.DISPONIBLE);
        propertyRepository.save(property);

        contractRepository.deleteById(id);
    }
}
