package BackEnd.Rentary.Tenants.DTOs;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantsResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
}
