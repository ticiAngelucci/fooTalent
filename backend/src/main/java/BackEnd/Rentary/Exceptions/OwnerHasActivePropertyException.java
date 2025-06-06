package BackEnd.Rentary.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class OwnerHasActivePropertyException extends RuntimeException {
    public OwnerHasActivePropertyException(String message) {
        super(message);
    }
}
