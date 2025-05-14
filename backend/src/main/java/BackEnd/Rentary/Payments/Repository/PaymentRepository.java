package BackEnd.Rentary.Payments.Repository;

import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByContractContractId(Long contractId, Pageable pageable);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.contract.contractId = :contractId AND p.serviceType = :serviceType")
    BigDecimal sumAmountByContractAndServiceType(@Param("contractId") Long contractId,
                                                 @Param("serviceType") ServiceType serviceType);

    Page<Payment> findByContractContractIdAndServiceTypeNot(Long contractId, ServiceType serviceType, Pageable pageable);

    Page<Payment> findByServiceType(ServiceType serviceType, Pageable pageable);

    Page<Payment> findByContractContractIdAndServiceType(Long contractId, ServiceType serviceType, Pageable pageable);

}