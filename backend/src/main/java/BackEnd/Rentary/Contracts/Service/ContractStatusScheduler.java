package BackEnd.Rentary.Contracts.Service;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import BackEnd.Rentary.Payments.Utils.PaymentCalculationUtil;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import BackEnd.Rentary.Properties.Repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractStatusScheduler {

    private final IContractRepository contractRepository;
    private final PropertyRepository propertyRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    @Scheduled(cron = "0 59 1 * * ?", zone = "UTC")
    public void updateContractStatus() {
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
        List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDIENTE);

        for (Payment payment : pendingPayments) {
            if (PaymentCalculationUtil.isPaymentOverdue(payment, today)) {
                payment.setStatus(PaymentStatus.VENCIDO);
                paymentRepository.save(payment);
            }

        }
    }
}
