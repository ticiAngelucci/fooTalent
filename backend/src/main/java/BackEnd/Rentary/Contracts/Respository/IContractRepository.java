package BackEnd.Rentary.Contracts.Respository;

import BackEnd.Rentary.Contracts.Entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByActiveTrue();
}
