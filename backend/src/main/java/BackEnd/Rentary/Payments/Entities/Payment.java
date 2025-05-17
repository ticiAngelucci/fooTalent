package BackEnd.Rentary.Payments.Entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Payments.Enums.Currency;
import BackEnd.Rentary.Payments.Enums.PaymentMethod;
import BackEnd.Rentary.Payments.Enums.PaymentStatus;
import BackEnd.Rentary.Payments.Enums.ServiceType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private LocalDate paymentDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Currency currency;

    @Column
    private String description;

    @Column(nullable = false)
    private int period;

    @Column(nullable = false)
    private int year;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    String createdBy;

    @Transient
    public boolean isOverdue() {
        if (this.status == PaymentStatus.PAGADO) {
            return false;
        }

        LocalDate deadlineDate = this.dueDate.plusDays(this.contract.getDeadline());
        return LocalDate.now().isAfter(deadlineDate);
    }

    @Transient
    public PaymentStatus calculateStatus() {
        if (this.status == PaymentStatus.PAGADO) {
            return PaymentStatus.PAGADO;
        }

        if (isOverdue()) {
            return PaymentStatus.VENCIDO;
        }

        return PaymentStatus.PENDIENTE;
    }

    public boolean applyPayment(LocalDate paymentDate, PaymentMethod method) {
        if (this.status == PaymentStatus.PAGADO) {
            return false;
        }

        this.paymentDate = paymentDate;
        this.paymentMethod = method;
        this.status = PaymentStatus.PAGADO;
        return true;
    }
    
    @Transient
    public boolean isRentPayment() {
        return this.serviceType == ServiceType.ALQUILER;
    }
}