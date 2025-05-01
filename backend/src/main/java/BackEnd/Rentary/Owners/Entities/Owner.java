package BackEnd.Rentary.Owners.Entities;

import BackEnd.Rentary.Common.Person;
import BackEnd.Rentary.Propertys.Entities.Property;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owners")
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Owner extends Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Property> properties= new ArrayList<>();
}