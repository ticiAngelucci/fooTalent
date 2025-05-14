package BackEnd.Rentary.Payments.Controller;

import BackEnd.Rentary.Payments.DTOs.PaymentRequest;
import BackEnd.Rentary.Payments.DTOs.PaymentResponse;
import BackEnd.Rentary.Payments.DTOs.PaymentSummaryResponse;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import BackEnd.Rentary.Payments.Mapper.PaymentMapper;
import BackEnd.Rentary.Payments.Service.Impl.PaymentServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    private final PaymentServiceImpl paymentService;
    private final PaymentMapper paymentMapper;

    @Operation(summary = "Registrar un nuevo pago", 
            description = "Registra un nuevo pago de renta o servicio para un contrato activo")
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
                request.description()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentMapper.toResponse(payment));
    }

    @Operation(summary = "Obtener pagos por contrato",
            description = "Obtiene todos los pagos asociados a un contrato específico")
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<Page<PaymentResponse>> getPaymentsByContract(
            @PathVariable Long contractId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos para el contrato ID: {}", contractId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentService.getPaymentsByContract(contractId, pageable);

        return ResponseEntity.ok(payments.map(paymentMapper::toResponse));
    }

    @Operation(summary = "Obtener pagos pendientes",
            description = "Obtiene todos los pagos pendientes de todos los contratos")
    @GetMapping("/pending")
    public ResponseEntity<Page<PaymentResponse>> getPendingPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos pendientes");

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> pendingPayments = paymentService.getPendingPayments(pageable);

        return ResponseEntity.ok(pendingPayments.map(paymentMapper::toResponse));
    }

    @Operation(summary = "Obtener detalles de un pago",
            description = "Obtiene los detalles completos de un pago específico")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        log.info("Obteniendo detalles del pago ID: {}", id);

        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(paymentMapper.toResponse(payment));
    }

    @Operation(summary = "Cancelar un pago pendiente",
            description = "Cancela un pago que aún no ha sido realizado")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelPayment(@PathVariable Long id) {
        log.info("Cancelando pago ID: {}", id);

        boolean cancelled = paymentService.cancelPayment(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", cancelled);
        response.put("message", "Pago cancelado exitosamente");

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Calcular saldo pendiente",
            description = "Calcula el saldo pendiente de pago para un contrato específico")
    @GetMapping("/pending-amount/{contractId}")
    public ResponseEntity<Map<String, Object>> getPendingAmount(@PathVariable Long contractId) {
        log.info("Calculando monto pendiente para contrato ID: {}", contractId);

        BigDecimal pendingAmount = paymentService.calculatePendingAmount(contractId);

        Map<String, Object> response = new HashMap<>();
        response.put("contractId", contractId);
        response.put("pendingAmount", pendingAmount);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizar estados de pagos",
            description = "Actualiza el estado de todos los pagos pendientes según la fecha actual")
    @PutMapping("/update-status")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus() {
        log.info("Actualizando estado de todos los pagos pendientes");

        paymentService.updatePaymentStatus();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Estados de pagos actualizados correctamente");

        return ResponseEntity.ok(response);
    }
    @Operation(summary = "Listar pagos de alquiler",
            description = "Obtiene todos los pagos cuyo tipo de servicio es ALQUILER")
    @GetMapping("/rental")
    public ResponseEntity<Page<PaymentSummaryResponse>> getRentalPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Obteniendo pagos de alquiler, página: {}, tamaño: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> rentalPayments = paymentService.getPaymentsByServiceType(ServiceType.ALQUILER, pageable);

        Page<PaymentSummaryResponse> response = rentalPayments.map(payment ->
                new PaymentSummaryResponse(
                        payment.getId(),
                        payment.getAmount(),
                        payment.getDueDate(),
                        payment.getPaymentDate(),
                        payment.getStatus(),
                        paymentMapper.getContractInfo(payment.getContract())
                )
        );

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar pagos por servicios",
            description = "Obtiene todos los pagos que no son de tipo ALQUILER")
    @GetMapping("/services")
    public ResponseEntity<Page<PaymentSummaryResponse>> getServicePayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) ServiceType serviceType) {

        log.info("Obteniendo pagos por servicios, página: {}, tamaño: {}, tipo: {}",
                page, size, serviceType != null ? serviceType : "TODOS");

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> servicePayments;

        if (serviceType != null && serviceType != ServiceType.ALQUILER) {
            servicePayments = paymentService.getPaymentsByServiceType(serviceType, pageable);
        } else {
            servicePayments = paymentService.getNonRentalPayments(pageable);
        }

        Page<PaymentSummaryResponse> response = servicePayments.map(payment ->
                new PaymentSummaryResponse(
                        payment.getId(),
                        payment.getAmount(),
                        payment.getDueDate(),
                        payment.getPaymentDate(),
                        payment.getStatus(),
                        paymentMapper.getContractInfo(payment.getContract())
                )
        );

        return ResponseEntity.ok(response);
    }
}