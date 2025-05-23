package BackEnd.Rentary.SendEmail.Service;

import BackEnd.Rentary.Auth.Services.EmailService;
import BackEnd.Rentary.SendEmail.DTO.SendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendServices {
    private final EmailService emailService;

    public void sendEmailFromLanding(SendDTO sendDTO) {
        String subject = "Nuevo mensaje desde Landing Page";
        String body = """
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Teléfono:</strong> %s</p>
                <p><strong>Mensaje:</strong><br>%s</p>
                """.formatted(
                sendDTO.fullName(),
                sendDTO.email(),
                sendDTO.phone(),
                sendDTO.text()
        );


        emailService.sendEmail("rentaryappweb@gmail.com", subject, body);
    }
}
