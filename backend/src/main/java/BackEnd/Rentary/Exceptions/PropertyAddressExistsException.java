package BackEnd.Rentary.Exceptions;

public class PropertyAddressExistsException extends RuntimeException {
    public PropertyAddressExistsException(String message) {
        super(message);
    }
}
