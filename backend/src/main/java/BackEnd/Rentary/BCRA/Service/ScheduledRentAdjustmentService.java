package BackEnd.Rentary.BCRA.Service;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Payments.Factory.PaymentFactory;
import BackEnd.Rentary.Payments.Repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static BackEnd.Rentary.BCRA.Util.Calcs.calculateAdjustedRent;

@Service
public class ScheduledRentAdjustmentService {

    private final IContractRepository contractRepository;
    private final BcraApiService bcraApiService;
    private final PaymentRepository paymentRepository;

    public ScheduledRentAdjustmentService(IContractRepository contractRepository, BcraApiService bcraApiService, PaymentRepository paymentRepository) {
        this.contractRepository = contractRepository;
        this.bcraApiService = bcraApiService;
        this.paymentRepository = paymentRepository;

    }

    @Scheduled(cron = "0 0 3 */10 * *")
    @Transactional
    public void updateCurrentRentForAllContracts() {
        List<Contract> activeContracts = contractRepository.findByActiveTrue();
        Double currentIcl = bcraApiService.getCurrentIclValueBlocking();

        for (Contract contract : activeContracts) {
            double newRent;
            if (contract.getAdjustmentType() == AdjustmentType.ICL && currentIcl != null) {
                newRent = calculateAdjustedRent(contract, currentIcl);
            } else {
                newRent = calculateAdjustedRent(contract, 0.0);
            }

            contract.setCurrentRent(newRent);
            int dayOfMonth = contract.getDeadline();
            LocalDate now = LocalDate.now();
            LocalDate dueDate;
            if (now.getDayOfMonth() >= dayOfMonth) {
                LocalDate nextMonth = now.plusMonths(1);
                int safeDay = Math.min(dayOfMonth, nextMonth.lengthOfMonth());
                dueDate = LocalDate.of(nextMonth.getYear(), nextMonth.getMonth(), safeDay);
            } else {
                int safeDay = Math.min(dayOfMonth, now.lengthOfMonth());
                dueDate = LocalDate.of(now.getYear(), now.getMonth(), safeDay);
            }
            Payment payment = PaymentFactory.createPaymentEntity(
                    contract,
                    BigDecimal.valueOf(newRent),
                    dueDate,
                    ServiceType.ALQUILER,
                    PaymentMethod.TRANSFERENCIA,
                    Currency.PESOS,
                    "Pago mensual automático",
                    contract.getCreatedBy()
            );
            payment.setPaymentDate(payment.getDueDate());

            payment.setStatus(PaymentStatus.PENDIENTE);
            paymentRepository.save(payment);
        }

        contractRepository.saveAll(activeContracts);
    }
}
