package BackEnd.Rentary.Contracts.Entity;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Contracts.Enums.AdjustmentFrequency;
import BackEnd.Rentary.Contracts.Enums.AdjustmentType;
import BackEnd.Rentary.Payments.Entities.Payment;
import BackEnd.Rentary.Properties.Entities.Property;
import BackEnd.Rentary.Tenants.entities.Tenants;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "contracts")
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contractId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    @JsonBackReference
    private Property property;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    @JsonBackReference
    private Tenants tenant;
    @Column(nullable = false)
    private LocalDate startDate;
    @Column(nullable = false)
    private LocalDate endDate;
    @Column(nullable = false)
    private double baseRent;
    @Column(nullable = false)
    private double deposit;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdjustmentFrequency adjustmentFrequency;
    @Column(nullable = false)
    private int deadline;
    @Column(nullable = false)
    private boolean active;
    @Column(nullable = false)
    private double adjustmentPercentage;
    private Double initialIcl;
    @Column(nullable = false)
    private double currentRent;
    @ElementCollection
    @CollectionTable(
            name = "contract_documents",
            joinColumns = @JoinColumn(name = "contract_id")
    )
    private Set<AttachedDocument> documents = new HashSet<>();
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdjustmentType adjustmentType;
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();
}
