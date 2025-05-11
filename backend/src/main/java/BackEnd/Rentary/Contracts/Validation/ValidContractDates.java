package BackEnd.Rentary.Contracts.Validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidContractDatesValidator.class)
@Target( { ElementType.TYPE } )
@Retention(RetentionPolicy.RUNTIME)

public @interface ValidContractDates {
    String message() default "La fecha de fin no puede ser anterior a la fecha de inicio.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
