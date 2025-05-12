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
    // @Column(name = "attached_document", length = 500)
    // private String attachedDocument;

    // Nuevos campos para el documento
    @Column(name = "document_name", length = 255)
    private String documentName;

    @Column(name = "document_type", length = 50)
    private String documentType;

    @Column(name = "document_extension", length = 10)
    private String documentExtension;

    @Column(name = "document_public_id", length = 255)
    private String documentPublicId;
}
