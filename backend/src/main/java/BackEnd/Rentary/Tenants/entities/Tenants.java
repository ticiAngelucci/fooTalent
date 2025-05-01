package BackEnd.Rentary.Tenants.entities;

import BackEnd.Rentary.Common.Person;
import jakarta.persistence.*;
import lombok.*;

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
}
