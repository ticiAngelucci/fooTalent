package BackEnd.Rentary.Tenants.entities;

import BackEnd.Rentary.Common.Person;
import BackEnd.Rentary.Contracts.Entity.Contract;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenants extends Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String warranty;
    @Column(name = "attached_document")
    private String attachedDocument;
    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL)
    private List<Contract> contracts = new ArrayList<>();
}
