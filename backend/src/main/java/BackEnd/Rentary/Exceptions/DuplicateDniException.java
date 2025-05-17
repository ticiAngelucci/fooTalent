package BackEnd.Rentary.Exceptions;

public class DuplicateDniException extends RuntimeException {
    public DuplicateDniException(String message) {
        super(message);
    }
}
