package BackEnd.GestorAlquileres.Common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class Person {
    private String name;
    private String lastName;
    private String dni;
    private String email;
    private String phone;
    private Address address;
}