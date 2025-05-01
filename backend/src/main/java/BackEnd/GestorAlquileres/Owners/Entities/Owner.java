package BackEnd.GestorAlquileres.Owners.Entities;

import BackEnd.GestorAlquileres.Common.Person;
import BackEnd.GestorAlquileres.Propertys.Entities.Property;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Owner extends Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Property property;

}
