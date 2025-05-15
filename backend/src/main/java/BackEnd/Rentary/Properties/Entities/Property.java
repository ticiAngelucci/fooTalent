package BackEnd.Rentary.Properties.Entities;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Contracts.Entity.Contract;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Properties.Enums.PropertyStatus;
import BackEnd.Rentary.Properties.Enums.TypeOfProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_property;
    @Column(nullable = false)
    @Embedded
    private Address address;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeOfProperty typeOfProperty;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PropertyStatus status;
    @Column(nullable = false, length = 1000)
    private String observations;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;
    @OneToMany(mappedBy = "property")
    private List<Contract> contracts = new ArrayList<>();
}
