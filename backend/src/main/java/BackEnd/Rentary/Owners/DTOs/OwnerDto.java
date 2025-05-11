package BackEnd.Rentary.Owners.DTOs;

import BackEnd.Rentary.Common.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OwnerDto {
    @NotNull
    private Long id;
    @NotNull(message = "Este campo es necesario.")
    private String name;
    @NotNull(message = "Este campo es necesario.")
    private String lastName;
    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe tener 8 dígitos numéricos")
    private String dni;
    @Email(message = "El email debe ser válido.")
    @NotNull(message = "Este campo es necesario.")
    private String email;
    @NotNull(message = "Este campo es necesario.")
    private String phone;
    @Valid
    @NotNull(message = "Este campo es necesario.")
    private Address address;

    private String attachedDocument;
}
