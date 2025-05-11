package BackEnd.Rentary.Exceptions;

public class ContractAlreadyExistsException extends RuntimeException {
    public ContractAlreadyExistsException(String message) {
        super(message);
    }
}
