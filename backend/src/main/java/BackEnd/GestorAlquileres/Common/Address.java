package BackEnd.GestorAlquileres.Common;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {
    private String country;
    private String province;
    private String locality;
    private String neighborhood;
    private String street;
    private String number;
    private String postalCode;
}