package BackEnd.Rentary.Common;

import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class Address {
    private String country;
    private String province;
    private String locality;
    private String street;
    private String number;
    private String postalCode;
}