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


@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findByContractContractIdAndCreatedBy(Long contractId, String createdBy, Pageable pageable);

    Page<Payment> findByContractContractIdAndServiceTypeAndCreatedBy(Long contractId, ServiceType serviceType, String createdBy, Pageable pageable);

    Page<Payment> findByContractContractIdAndServiceTypeNotAndCreatedBy(Long contractId, ServiceType serviceType, String createdBy, Pageable pageable);

    Page<Payment> findByStatusAndCreatedBy(PaymentStatus status, String createdBy, Pageable pageable);

    List<Payment> findByStatusAndCreatedBy(PaymentStatus status, String createdBy);

    Page<Payment> findByServiceTypeAndCreatedBy(ServiceType serviceType, String createdBy, Pageable pageable);

    Page<Payment> findByCreatedBy(String createdBy, Pageable pageable);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.contract.contractId = :contractId AND p.serviceType = :serviceType AND p.createdBy = :createdBy")
    BigDecimal sumAmountByContractAndServiceTypeAndCreatedBy(@Param("contractId") Long contractId,
                                                             @Param("serviceType") ServiceType serviceType,
                                                             @Param("createdBy") String createdBy);
}
