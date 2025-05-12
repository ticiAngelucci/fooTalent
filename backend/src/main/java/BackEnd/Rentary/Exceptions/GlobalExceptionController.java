package BackEnd.Rentary.Exceptions;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse(
                "VALIDATION_ERROR",
                "Errores de validación en los campos enviados",
                details
        );

        log.warn("Validation error: {}", details);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "INVALID_REQUEST_BODY",
                "El formato del cuerpo de la solicitud es inválido",
                Collections.singletonList("Verifica la sintaxis JSON y los tipos de datos enviados")
        );

        log.warn("Invalid request body: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<ErrorResponse> handleInvalidDataAccessApiUsage(InvalidDataAccessApiUsageException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "INVALID_QUERY_PARAMETER",
                "Error en los parámetros de consulta",
                Collections.singletonList(ex.getMostSpecificCause().getMessage())
        );

        log.warn("Invalid data access: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> details = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());

        ErrorResponse errorResponse = new ErrorResponse(
                "CONSTRAINT_VIOLATION",
                "Violación de restricciones en los datos",
                details
        );

        log.warn("Constraint violation: {}", details);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        List<String> supportedMethods = ex.getSupportedHttpMethods() != null ?
                ex.getSupportedHttpMethods().stream().map(Object::toString).collect(Collectors.toList()) :
                Collections.emptyList();

        ErrorResponse errorResponse = new ErrorResponse(
                "METHOD_NOT_ALLOWED",
                "Método HTTP no soportado: " + ex.getMethod(),
                Collections.singletonList("Métodos soportados: " + String.join(", ", supportedMethods))
        );

        log.warn("Method not allowed: {} for path {}", ex.getMethod(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "RESOURCE_NOT_FOUND",
                "El recurso solicitado no existe",
                Collections.singletonList("Path: " + ex.getRequestURL())
        );

        log.warn("Resource not found: {}", ex.getRequestURL());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "ACCESS_DENIED",
                "Acceso denegado",
                Collections.singletonList("No tienes los permisos necesarios para realizar esta acción")
        );

        log.warn("Access denied for user");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "SERVER_ERROR",
                "Ha ocurrido un error en el servidor",
                Collections.singletonList(ex.getMessage())
        );

        log.error("Internal server error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    // Errores Personalizados
    @ExceptionHandler(ContractNorFoundException.class)
    public ResponseEntity<ErrorResponse> handleContractNotFoundException(ContractNorFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "CONTRACT_NOT_FOUND",
                "El contrato solicitado no existe",
                Collections.singletonList("ID del contrato: " + ex.getMessage())
        );

        log.warn("Contract not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePaymentNotFoundException(PaymentNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "PAYMENT_NOT_FOUND",
                "El pago solicitado no existe",
                Collections.singletonList("ID del pago: " + ex.getMessage())
        );

        log.warn("Payment not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ContractAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleContractAlreadyExistsException(ContractAlreadyExistsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "CONTRACT_ALREADY_EXISTS",
                "El contrato ya existe",
                Collections.singletonList("ID del contrato: " + ex.getMessage())
        );

        log.warn("Contract already exists: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(PropertyNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlePropertyNotFoundException(PropertyNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "PROPERTY_NOT_FOUND",
                "El inmueble solicitado no existe",
                Collections.singletonList("ID del inmueble: " + ex.getMessage())
        );

        log.warn("Property not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(TenantNotFoundExceptions.class)
    public ResponseEntity<ErrorResponse> handleTenantNotFoundException(TenantNotFoundExceptions ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "TENANT_NOT_FOUND",
                "El inquilino solicitado no existe",
                Collections.singletonList("ID del inquilino: " + ex.getMessage())
        );

        log.warn("Tenant not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(PropertyUnavailableException.class)
    public ResponseEntity<ErrorResponse> handlePropertyUnavailableException(PropertyUnavailableException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "PROPERTY_UNAVAILABLE",
                "El inmueble no está disponible",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("Property unavailable: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(OwnerNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOwnerNotFoundException(OwnerNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "OWNER_NOT_FOUND",
                "El propietario solicitado no existe",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("Owner not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(DuplicateDniException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateDniException(DuplicateDniException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "DUPLICATE_DNI",
                "DNI duplicado",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("Duplicate DNI: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(PropertyAddressExistsException.class)
    public ResponseEntity<ErrorResponse> handlePropertyAddressExistsException(PropertyAddressExistsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "PROPERTY_ADDRESS_EXISTS",
                "Dirección de inmueble duplicada",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("Property address exists: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(PropertyDeletedStatusException.class)
    public ResponseEntity<ErrorResponse> handlePropertyDeletedStatusException(PropertyDeletedStatusException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "PROPERTY_DELETED",
                "Inmueble no disponible para modificación",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("Attempt to modify deleted property: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "FILE_UPLOAD_ERROR",
                "Error al subir o procesar el archivo",
                Collections.singletonList(ex.getMessage())
        );

        log.warn("File upload error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}