package BackEnd.Rentary.Propertys.Entities;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Owners.Entities.Owner;
import BackEnd.Rentary.Propertys.Enums.Status;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "propertys")
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
    private Status status;
    @Column(nullable = false, length = 1000)
    private String observations;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;
}