package BackEnd.Rentary.Payments.Utils;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Contracts.Respository.IContractRepository;
import BackEnd.Rentary.Exceptions.ContractNotFoundException;
import BackEnd.Rentary.Exceptions.InvalidPaymentException;

import java.math.BigDecimal;


public class PaymentValidationUtil {


    public static void validatePaymentAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("El monto del pago debe ser mayor que cero");
        }
    }

    public static void validateContractExists(IContractRepository contractRepository, Long contractId) {
        if (!contractRepository.existsById(contractId)) {
            throw new ContractNotFoundException(contractId.toString());
        }
    }


    public static Contract findAndValidateContract(IContractRepository contractRepository, Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNotFoundException(contractId.toString()));

        if (!contract.isActive()) {
            throw new InvalidPaymentException("No se puede registrar un pago para un contrato inactivo");
        }

        return contract;
    }
}