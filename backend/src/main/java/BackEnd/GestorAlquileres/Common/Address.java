package BackEnd.GestorAlquileres.Common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    private String country;
    private String province;
    private String locality;
    private String neighborhood;
    private String street;
    private String number;
    private String postalCode;
}