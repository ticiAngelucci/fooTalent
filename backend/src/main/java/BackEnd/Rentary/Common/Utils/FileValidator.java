package BackEnd.Rentary.Common.Utils;

import BackEnd.Rentary.Common.Enums.FileCategory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Component
@Slf4j
public class FileValidator {

    private static final String[] ACCEPTED_PDF_TYPES = {
            "application/pdf",
            "application/x-pdf",
            "application/acrobat",
            "application/octet-stream"
    };

    private static final String[] ACCEPTED_IMAGE_TYPES = {
            "image/jpeg",
            "image/jpg",
            "image/png"
    };


    public boolean isImageFile(String contentType, String fileExtension) {
        return (contentType != null && Arrays.asList(ACCEPTED_IMAGE_TYPES).contains(contentType)) ||
                (fileExtension != null && (fileExtension.equalsIgnoreCase(".jpg") ||
                        fileExtension.equalsIgnoreCase(".jpeg") ||
                        fileExtension.equalsIgnoreCase(".png")));
    }


    public boolean isPdfFile(String contentType, String fileExtension) {
        return (contentType != null && Arrays.asList(ACCEPTED_PDF_TYPES).contains(contentType)) ||
                (fileExtension != null && fileExtension.equalsIgnoreCase(".pdf"));
    }

    public FileCategory determineFileCategory(String contentType, String fileExtension) {
        if (isImageFile(contentType, fileExtension)) {
            return FileCategory.IMAGE;
        } else if (isPdfFile(contentType, fileExtension)) {
            return FileCategory.DOCUMENT;
        } else {
            throw new IllegalArgumentException(
                    "Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPG, PNG). Tipo detectado: "
                            + contentType);
        }
    }


    public String determineFileExtension(String contentType) {
        if (contentType != null) {
            if (contentType.contains("pdf")) {
                return ".pdf";
            } else if (contentType.contains("jpeg") || contentType.contains("jpg")) {
                return ".jpg";
            } else if (contentType.contains("png")) {
                return ".png";
            }
        }
        return "";
    }
}