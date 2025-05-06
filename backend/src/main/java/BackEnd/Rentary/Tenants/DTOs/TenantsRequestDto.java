package BackEnd.Rentary.Tenants.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantsRequestDto {
    @NotNull(message = "El nombre es requerido")
    private String firstName;

    @NotNull(message = "El apellido es requerido")
    private String lastName;

    @Email(message = "El email debe ser válido")
    @NotNull(message = "El email es requerido")
    private String email;

    @NotNull(message = "El teléfono es requerido")
    private String phone;

    private String warranty;

    private String dni;

    private String country;
    private String province;
    private String locality;
    private String neighborhood;
    private String street;
    private String number;
    private String postalCode;

    private MultipartFile document;
}