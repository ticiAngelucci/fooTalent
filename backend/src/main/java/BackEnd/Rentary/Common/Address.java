package BackEnd.Rentary.Common;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class Address {
    @NotNull
    private String country;
    @NotNull
    private String province;
    @NotNull
    private String locality;
    @NotNull
    private String street;
    @NotNull
    private String number;
    @NotNull
    private String postalCode;
}