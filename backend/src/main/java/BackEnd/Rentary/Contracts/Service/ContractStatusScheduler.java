package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Propertys.Entities.Property;
import BackEnd.Rentary.Propertys.Enums.PropertyStatus;
import BackEnd.Rentary.Propertys.Repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractStatusScheduler {

    private final IContractRepository contractRepository;
    private final PropertyRepository propertyRepository;

    @Transactional
    @Scheduled(cron = "0 22 13 * * ?")
    public void updateContractStatus(){
        List<Contract> activeContracts = contractRepository.findByActiveTrue();
        LocalDate today = LocalDate.now();

        for (Contract contract : activeContracts) {
            if (!contract.getEndDate().isAfter(today)) {
                contract.setActive(false);
                contractRepository.save(contract);

                Property property = contract.getProperty();
                property.setStatus(PropertyStatus.DISPONIBLE);
                propertyRepository.save(property);
            }
        }
    }
}
