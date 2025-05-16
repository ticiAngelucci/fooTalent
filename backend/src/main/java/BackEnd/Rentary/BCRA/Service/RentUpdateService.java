package BackEnd.Rentary.BCRA.Service;


import BackEnd.Rentary.BCRA.Util.Calcs;
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
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class RentUpdateService {

    private final IContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final BcraApiService bcraApiService;

    public RentUpdateService(IContractRepository contractRepository, PaymentRepository paymentRepository, BcraApiService bcraApiService) {
        this.contractRepository = contractRepository;
        this.paymentRepository = paymentRepository;
        this.bcraApiService = bcraApiService;
    }

    @Transactional
    public void updateCurrentRentAndPayments() {
        List<Contract> activeContracts = contractRepository.findByActiveTrue();
        Double currentIcl = bcraApiService.getCurrentIclValueBlocking();

        for (Contract contract : activeContracts) {
            double newRent;
            if (contract.getAdjustmentType() == AdjustmentType.ICL && currentIcl != null) {
                newRent = Calcs.calculateAdjustedRent(contract, currentIcl);
            } else {
                newRent = Calcs.calculateAdjustedRent(contract, 0.0);
            }

            contract.setCurrentRent(newRent);

            Payment payment = PaymentFactory.createPaymentEntity(
                    contract,
                    BigDecimal.valueOf(newRent).setScale(0, RoundingMode.HALF_UP),
                    null,
                    ServiceType.ALQUILER,
                    PaymentMethod.TRANSFERENCIA,
                    Currency.PESOS,
                    "Pago mensual automático (test)",
                    contract.getCreatedBy()

            );
            payment.setStatus(PaymentStatus.PENDIENTE);
            paymentRepository.save(payment);
        }

        contractRepository.saveAll(activeContracts);
        System.out.println("Rentas y pagos actualizados correctamente.");
    }
}