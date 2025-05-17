package BackEnd.Rentary.Tenants.entities;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.Person;
import BackEnd.Rentary.Contracts.Entity.Contract;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contract> contracts = new ArrayList<>();
    @ElementCollection
    @CollectionTable(
            name = "tenant_documents",
            joinColumns = @JoinColumn(name = "tenant_id"))
    private Set<AttachedDocument> documents = new HashSet<>();
}
