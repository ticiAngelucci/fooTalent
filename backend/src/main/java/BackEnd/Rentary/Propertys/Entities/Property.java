package BackEnd.Rentary.Propertys.Entities;

import BackEnd.Rentary.Common.Address;
import BackEnd.Rentary.Propertys.Enums.Status;
import BackEnd.Rentary.Propertys.Enums.TypeOfProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Property {
    private Long id_property;
    private Address address;
    private TypeOfProperty typeOfProperty;
    private Status status;
    private String observations;
    /*private Owner owner;*/
}