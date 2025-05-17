package BackEnd.Rentary.Contracts.Validation;

import BackEnd.Rentary.Contracts.DTOs.ContractRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidContractDatesValidator implements ConstraintValidator<ValidContractDates, ContractRequest> {
    @Override
    public boolean isValid(ContractRequest request, ConstraintValidatorContext constraintValidatorContext) {
        if (request.startDate() == null || request.endDate() == null) {
            return true;
        }
        return !request.endDate().isBefore(request.startDate());
    }
}
