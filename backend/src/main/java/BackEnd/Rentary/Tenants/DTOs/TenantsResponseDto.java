package BackEnd.Rentary.Tenants.DTOs;

import BackEnd.Rentary.Common.DTOs.DocumentDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private String country;
    private String province;
    private String locality;
    private String street;
    private String number;
    private String postalCode;
    private List<DocumentDto> documents;
}