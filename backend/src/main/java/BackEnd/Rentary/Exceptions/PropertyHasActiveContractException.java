package BackEnd.Rentary.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class PropertyHasActiveContractException extends RuntimeException {
    public PropertyHasActiveContractException(String message) {
        super(message);
    }
}
