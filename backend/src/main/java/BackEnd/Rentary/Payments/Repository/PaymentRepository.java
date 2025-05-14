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

    @Query("SELECT p FROM Payment p WHERE p.contract.contractId = :contractId AND p.period = :month AND p.year = :year AND p.serviceType = :serviceType")
    Optional<Payment> findByContractAndPeriodAndServiceType(
            @Param("contractId") Long contractId,
            @Param("month") int month,
            @Param("year") int year,
            @Param("serviceType") ServiceType serviceType);

    List<Payment> findByContractContractIdAndServiceType(Long contractId, ServiceType serviceType);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.contract.contractId = :contractId AND p.status = :status")
    long countByContractAndStatus(@Param("contractId") Long contractId, @Param("status") PaymentStatus status);
}