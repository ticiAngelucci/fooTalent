package BackEnd.Rentary.SendEmail.Controller;

import BackEnd.Rentary.SendEmail.DTO.SendDTO;
import BackEnd.Rentary.SendEmail.Service.SendServices;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sendEmailLanding")
@RequiredArgsConstructor
public class SendEmailController {
    private final SendServices sendServices;

    @Operation(summary = "Envio de email de contacto desde landing page")
    @PostMapping()
    public ResponseEntity<String> sendEmail(@Valid @RequestBody SendDTO sendDTO) {
        sendServices.sendEmailFromLanding(sendDTO);
        return ResponseEntity.ok("Email enviado correctamente.");
    }
}