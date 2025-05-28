package BackEnd.Rentary.SendEmail.DTO;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SendDTO(
        @Schema(example = "Juan Pérez")
        @NotBlank(message = "El nombre completo es obligatorio")
        @Pattern(regexp = "^[a-zA-Z]{3,}\\s[a-zA-Z]{4,}$", message = "Debe tener un nombre de al menos 3 letras y un apellido de al menos 4 letras, separados por un espacio")
        String fullName,
        @Schema(example = "example@exmaple.com")
        @NotBlank(message = "El email es obligatorio")
        @Pattern(regexp = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}$", message = "Email no válido")
        String email,
        @Schema(example = " 1112345678")
        @NotBlank(message = "El teléfono es obligatorio")
        @Size(min = 7, max = 20, message = "El teléfono debe tener entre 7 y 20 caracteres")
        String phone,
        @Schema(example = "Hola, me gustaria obtener informacion del servicio")
        @NotBlank(message = "El mensaje es obligatorio")
        @Size(min = 20, max = 1000, message = "El mensaje no puede superar los 1000 caracteres")
        String text) {
}
