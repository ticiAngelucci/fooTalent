package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import BackEnd.Rentary.Contracts.DTOs.ContractResponse;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Mapper.ContractMapper;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.ContractNorFoundException;
import BackEnd.Rentary.Exceptions.PropertyNotFoundException;
import BackEnd.Rentary.Exceptions.PropertyUnavailableException;
import BackEnd.Rentary.Exceptions.TenantNotFoundExceptions;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Repositoy.PropertyRepository;
import BackEnd.Rentary.Tenants.entities.Tenants;
import BackEnd.Rentary.Tenants.repositories.TenantsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractServiceImpl implements IContractService {

    private final IContractRepository contractRepository;
    private final PropertyRepository propertyRepository;
    private final TenantsRepository tenantsRepository;
    private final ContractMapper contractMapper;

    @Override
    public ContractResponse createContract(ContractRequest request) {
        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new PropertyNotFoundException(request.propertyId().toString()));

        if (property.getStatus() == PropertyStatus.OCUPADO) {
            log.error("Inmueble con ID: {} ya está ocupado", request.propertyId());
            throw new PropertyUnavailableException("Inmueble con ID: " + request.propertyId() + " ya está ocupado");
        }

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        Contract contract = contractMapper.toEntity(request, property, tenant);
        contract.setTenant(tenant);
        contract.setActive(true);

        property.setStatus(PropertyStatus.OCUPADO);
        propertyRepository.save(property);

        contractRepository.save(contract);

        log.info("Contrato creado exitosamente para propiedad ID: {} y inquilino ID: {}",
                request.propertyId(), request.tenantId());

        return contractMapper.toResponse(contract);
    }

    @Override
    public ContractResponse getContractById(Long id) {
        return contractRepository.findById(id)
                .map(contractMapper::toResponse)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));
    }

    @Override
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable)
                .map(contractMapper::toResponse);
    }

    @Override
    @Transactional
    public ContractResponse updateContract(Long id, ContractRequest request) {
        Contract existing = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));

        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new PropertyNotFoundException(request.propertyId().toString()));

        Tenants tenant = tenantsRepository.findById(request.tenantId())
                .orElseThrow(() -> new TenantNotFoundExceptions(request.tenantId().toString()));

        Contract updated = contractMapper.toEntity(request, property, tenant);
        updated.setContractId(id);

        log.info("Contrato actualizado: ID {}", id);

        return contractMapper.toResponse(contractRepository.save(updated));
    }

    @Override
    public void deleteContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ContractNorFoundException(id.toString()));

        Property property = contract.getProperty();
        property.setStatus(PropertyStatus.DISPONIBLE);
        propertyRepository.save(property);

        contractRepository.deleteById(id);
        log.info("Contrato eliminado: ID {}", id);
    }
}