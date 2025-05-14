package BackEnd.Rentary.Payments.Controller;

import BackEnd.Rentary.Payments.DTOs.*;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Payments.Mapper.PaymentMapper;
import BackEnd.Rentary.Payments.Service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Pagos", description = "API para la gestión de pagos de contratos")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;

    @Operation(summary = "Registrar un nuevo pago", description = "Registra un nuevo pago de renta o servicio para un contrato activo")
    @PostMapping
    public ResponseEntity<PaymentResponse> registerPayment(@RequestBody @Valid PaymentRequest request) {
        log.info("Registrando pago de tipo {} para contrato ID: {}, monto: {}",
                request.serviceType(), request.contractId(), request.amount());

        Payment payment = paymentService.registerPayment(
                request.contractId(),
                request.amount(),
                request.paymentDate(),
                request.serviceType(),
                request.paymentMethod(),
                request.currency(),
                request.description());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentMapper.toResponse(payment));
    }

    @Operation(summary = "Obtener pagos por contrato", description = "Obtiene todos los pagos asociados a un contrato específico")
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<PaymentResponsePage> getPaymentsByContract(
            @PathVariable Long contractId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos para el contrato ID: {}", contractId);
        PaymentResponsePage responsePage = paymentService.getPaymentsByContract(contractId, page, size);
        return ResponseEntity.ok(responsePage);
    }

    @Operation(summary = "Obtener pagos pendientes", description = "Obtiene todos los pagos pendientes de todos los contratos")
    @GetMapping("/pending")
    public ResponseEntity<PaymentResponsePage> getPendingPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos pendientes");
        PaymentResponsePage responsePage = paymentService.getPendingPayments(page, size);
        return ResponseEntity.ok(responsePage);
    }

    @Operation(summary = "Obtener detalles de un pago", description = "Obtiene los detalles completos de un pago específico")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        log.info("Obteniendo detalles del pago ID: {}", id);

        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(paymentMapper.toResponse(payment));
    }

    @Operation(summary = "Cancelar un pago pendiente", description = "Cancela un pago que aún no ha sido realizado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelPayment(@PathVariable Long id) {
        log.info("Cancelando pago ID: {}", id);

        boolean cancelled = paymentService.cancelPayment(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", cancelled);
        response.put("message", "Pago cancelado exitosamente");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Calcular saldo pendiente", description = "Calcula el saldo pendiente de pago para un contrato específico")
    @GetMapping("/pending-amount/{contractId}")
    public ResponseEntity<Map<String, Object>> getPendingAmount(@PathVariable Long contractId) {
        log.info("Calculando monto pendiente para contrato ID: {}", contractId);

        BigDecimal pendingAmount = paymentService.calculatePendingAmount(contractId);

        Map<String, Object> response = new HashMap<>();
        response.put("contractId", contractId);
        response.put("pendingAmount", pendingAmount);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizar estados de pagos", description = "Actualiza el estado de todos los pagos pendientes según la fecha actual")
    @PutMapping("/update-status")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus() {
        log.info("Actualizando estado de todos los pagos pendientes");

        paymentService.updatePaymentStatus();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estados de pagos actualizados correctamente");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar todos los pagos con detalles completos", description = "Obtiene todos los pagos con información detallada del contrato, inquilino, frecuencia de ajuste, valor del alquiler y fecha límite")
    @GetMapping("/all-details")
    public ResponseEntity<PaymentDetailedResponsePage> getAllPaymentsDetailed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo todos los pagos con detalles completos, página: {}, tamaño: {}", page, size);

        PaymentDetailedResponsePage responsePage = paymentService.getAllPaymentsDetailed(page, size);
        return ResponseEntity.ok(responsePage);
    }

    @Operation(summary = "Listar pagos de alquiler", description = "Obtiene todos los pagos cuyo tipo de servicio es ALQUILER para un contrato específico")
    @GetMapping("/rental/{contractId}")
    public ResponseEntity<PaymentRentalResponsePage> getRentalPaymentsByContract(
            @PathVariable Long contractId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos de alquiler para contrato ID: {}, página: {}, tamaño: {}",
                contractId, page, size);

        PaymentRentalResponsePage response = paymentService.getRentalPaymentsByContract(contractId, page, size);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar pagos por servicios", description = "Obtiene todos los pagos que no son de tipo ALQUILER para un contrato específico, opcionalmente filtrados por tipo de servicio")
    @GetMapping("/services/{contractId}")
    public ResponseEntity<ServicePaymentResponsePage> getServicePaymentsByContract(
            @PathVariable Long contractId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ServiceType serviceType) {

        log.info("Obteniendo pagos por servicios para contrato ID: {}, página: {}, tamaño: {}, tipo: {}",
                contractId, page, size, serviceType != null ? serviceType : "TODOS");

        ServicePaymentResponsePage response;

        if (serviceType != null && serviceType != ServiceType.ALQUILER) {
            response = paymentService.getServicePaymentsByContractAndType(contractId, serviceType, page, size);
        } else {
            response = paymentService.getAllServicePaymentsByContract(contractId, page, size);
        }

        return ResponseEntity.ok(response);
    }
}