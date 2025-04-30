package BackEnd.GestorAlquileres.Propertys.Entities;

import BackEnd.GestorAlquileres.Common.Address;
import BackEnd.GestorAlquileres.Propertys.Enums.Status;
import BackEnd.GestorAlquileres.Propertys.Enums.TypeOfProperty;
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