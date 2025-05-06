package BackEnd.Rentary.Tenants.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantsResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String dni;
    private String warranty;
    private String attachedDocument;

    private String country;
    private String province;
    private String locality;
    private String neighborhood;
    private String street;
    private String number;
    private String postalCode;
}