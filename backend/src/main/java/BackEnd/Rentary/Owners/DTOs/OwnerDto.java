package BackEnd.Rentary.Owners.DTOs;


import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Propertys.Entities.Property;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerDto {

    private String name;
    private String lastName;
    private String dni;
    private String email;
    private String phone;

    @Valid
    @NotNull(message = "the field cannot be null")
    private Property property;

}
