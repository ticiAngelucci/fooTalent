package BackEnd.Rentary.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
public class ContractNotExpiredException extends RuntimeException{

    public ContractNotExpiredException(String message) {
        super(message);
    }
}
