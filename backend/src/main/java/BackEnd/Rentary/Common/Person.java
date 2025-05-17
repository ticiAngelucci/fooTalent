package BackEnd.Rentary.Common;

import jakarta.persistence.Embedded;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class Person {
    private String firstName;
    private String lastName;
    private String dni;
    private String email;
    private String phone;
    @Embedded
    private Address address;
}