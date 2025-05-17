package BackEnd.Rentary.Exceptions;

public class PropertyNotFoundException extends RuntimeException {
    public PropertyNotFoundException(String message) {
        super(message);
    }
}
