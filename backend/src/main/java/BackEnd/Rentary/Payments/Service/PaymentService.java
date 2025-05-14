package BackEnd.Rentary.Payments.Service;

import BackEnd.Rentary.Payments.DTOs.PaymentDetailedResponsePage;
import BackEnd.Rentary.Payments.DTOs.PaymentResponsePage;
import BackEnd.Rentary.Payments.DTOs.PaymentResponse;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.ServiceType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Interfaz que define los servicios para la gestión de pagos
 */
public interface PaymentService {

    /**
     * Registra un nuevo pago para un contrato
     */
    Payment registerPayment(
            Long contractId,
            BigDecimal amount,
            LocalDate paymentDate,
            ServiceType serviceType,
            PaymentMethod paymentMethod,
            Currency currency,
            String description);

    /**
     * Obtiene todos los pagos asociados a un contrato específico
     */
    PaymentResponsePage getPaymentsByContract(Long contractId, int page, int size);

    /**
     * Obtiene todos los pagos con estado pendiente
     */
    PaymentResponsePage getPendingPayments(int page, int size);

    /**
     * Actualiza el estado de los pagos pendientes a vencidos cuando corresponda
     */
    void updatePaymentStatus();

    /**
     * Calcula el monto pendiente de pago para un contrato
     */
    BigDecimal calculatePendingAmount(Long contractId);

    /**
     * Obtiene un pago por su ID
     */
    Payment getPaymentById(Long paymentId);

    /**
     * Obtiene pagos filtrados por tipo de servicio
     */
    PaymentResponsePage getPaymentsByServiceType(ServiceType serviceType, int page, int size);

    /**
     * Obtiene versión reducida de pagos por tipo de servicio
     */
    PaymentResponsePage getPaymentsSummaryByServiceType(ServiceType serviceType, int page, int size);

    /**
     * Obtiene pagos que no son de tipo ALQUILER
     */
    PaymentResponsePage getNonRentalPayments(int page, int size);

    /**
     * Obtiene versión reducida de pagos no relacionados con alquiler
     */
    PaymentResponsePage getNonRentalPaymentsSummary(int page, int size);
    
    /**
     * Obtiene todos los pagos con información detallada del contrato e inquilino
     */
    PaymentDetailedResponsePage getAllPaymentsDetailed(int page, int size);

    /**
     * Cancela un pago pendiente
     */
    boolean cancelPayment(Long paymentId);
}