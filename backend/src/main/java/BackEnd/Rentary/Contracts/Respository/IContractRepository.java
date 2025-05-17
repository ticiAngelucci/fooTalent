package BackEnd.Rentary.Contracts.Respository;

import BackEnd.Rentary.Contracts.Entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByActiveTrue();

    Optional<Contract> findByContractIdAndCreatedBy(Long contractId, String createdBy);

    Page<Contract> findByCreatedBy(String createdBy, Pageable pageable);

}
