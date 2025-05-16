package BackEnd.Rentary.Owners.Entities;

import BackEnd.Rentary.Common.AttachedDocument;
import BackEnd.Rentary.Common.Person;
import BackEnd.Rentary.Properties.Entities.Property;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "owners")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Owner extends Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Property> properties= new ArrayList<>();
    @ElementCollection
    @CollectionTable(
            name = "owner_documents",
            joinColumns = @JoinColumn(name = "owner_id")
    )
    private Set<AttachedDocument> documents = new HashSet<>();

}
