package BackEnd.Rentary.Tenants.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {
    private final Cloudinary cloudinary;

    // Lista de tipos MIME aceptados para PDF
    private static final String[] ACCEPTED_PDF_TYPES = {
            "application/pdf",
            "application/x-pdf",
            "application/acrobat",
            "application/octet-stream"
    };

    public String uploadFile(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            String filename = file.getOriginalFilename();
            
            log.info("Subiendo archivo: {} con tipo de contenido: {}", filename, contentType);
            
            // Verificar si el tipo de contenido es aceptado o la extensión es PDF
            boolean isPdfContentType = contentType != null && Arrays.asList(ACCEPTED_PDF_TYPES).contains(contentType);
            boolean isPdfFilename = filename != null && filename.toLowerCase().endsWith(".pdf");
            
            if (!isPdfContentType && !isPdfFilename) {
                throw new IllegalArgumentException("Solo se permiten archivos PDF. Tipo detectado: " + contentType);
            }
            
            // Para PDFs y application/octet-stream, usar resource_type: raw
            Map<String, Object> params = ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", "rentary/tenants/documents"
            );
            
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String secureUrl = (String) uploadResult.get("secure_url");
            log.info("Archivo subido con éxito a Cloudinary: {}", secureUrl);
            
            return secureUrl;
        } catch (IOException e) {
            log.error("Error al subir archivo a Cloudinary", e);
            throw new RuntimeException("Error al subir archivo: " + e.getMessage());
        }
    }

    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Archivo eliminado con éxito de Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Error al eliminar archivo de Cloudinary", e);
            throw new RuntimeException("Error al eliminar archivo: " + e.getMessage());
        }
    }
}