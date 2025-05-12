package BackEnd.Rentary.Exceptions;

public class TenantNotFoundExceptions extends RuntimeException {
    public TenantNotFoundExceptions(String message) {
        super(message);
    }
}
