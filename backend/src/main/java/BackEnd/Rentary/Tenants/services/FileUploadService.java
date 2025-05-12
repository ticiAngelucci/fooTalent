package BackEnd.Rentary.Tenants.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {
    private final Cloudinary cloudinary;

    // Lista de tipos MIME aceptados
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

    public static class FileUploadResult {
        private String url;
        private String publicId;
        private String originalName;
        private String fileType;
        private String extension;
        private String uniqueName;

        public FileUploadResult(String url, String publicId, String originalName, String fileType, String extension,
                String uniqueName) {
            this.url = url;
            this.publicId = publicId;
            this.originalName = originalName;
            this.fileType = fileType;
            this.extension = extension;
            this.uniqueName = uniqueName;
        }

        public String getUrl() {
            return url;
        }

        public String getPublicId() {
            return publicId;
        }

        public String getOriginalName() {
            return originalName;
        }

        public String getFileType() {
            return fileType;
        }

        public String getExtension() {
            return extension;
        }

        public String getUniqueName() {
            return uniqueName;
        }
    }

    public FileUploadResult uploadFileWithDetails(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();

            log.info("Subiendo archivo: {} con tipo de contenido: {}", originalFilename, contentType);

            // Determinar un nombre "limpio" para el archivo (sin caracteres especiales)
            String cleanFileName = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_")
                    : "archivo";

            // Extraer la extensión del archivo original
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                cleanFileName = cleanFileName.substring(0, cleanFileName.lastIndexOf("."));
            } else {
                // Si no hay extensión, intentar determinarla por el contentType
                if (contentType != null) {
                    if (contentType.equals("application/pdf") || contentType.contains("pdf")) {
                        fileExtension = ".pdf";
                    } else if (contentType.equals("image/jpeg") || contentType.contains("jpeg")
                            || contentType.contains("jpg")) {
                        fileExtension = ".jpg";
                    } else if (contentType.equals("image/png") || contentType.contains("png")) {
                        fileExtension = ".png";
                    }
                }
            }

            // Determinar el tipo de archivo y la carpeta de destino
            String folder;
            Map<String, Object> params;
            String fileType;

            // Verificar si el archivo es una imagen
            boolean isImage = contentType != null &&
                    (Arrays.asList(ACCEPTED_IMAGE_TYPES).contains(contentType) ||
                            fileExtension.equalsIgnoreCase(".jpg") ||
                            fileExtension.equalsIgnoreCase(".jpeg") ||
                            fileExtension.equalsIgnoreCase(".png"));

            // Verificar si el archivo es un PDF
            boolean isPdf = contentType != null &&
                    (Arrays.asList(ACCEPTED_PDF_TYPES).contains(contentType) ||
                            fileExtension.equalsIgnoreCase(".pdf"));

            if (isImage) {
                folder = "rentary/tenants/images";
                fileType = "image";
                params = ObjectUtils.asMap("folder", folder);
            } else if (isPdf) {
                folder = "rentary/tenants/documents";
                fileType = "document";
                params = ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", folder);
            } else {
                throw new IllegalArgumentException(
                        "Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPG, PNG). Tipo detectado: "
                                + contentType);
            }

            // Generar un nombre de archivo descriptivo que incluya parte del nombre
            // original + UUID + extensión
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            // Tomamos hasta 10 caracteres del nombre original para hacerlo más legible
            String shortOriginalName = cleanFileName.length() > 10 ? cleanFileName.substring(0, 10) : cleanFileName;

            String uniqueFileName = shortOriginalName + "_" + uniqueId + fileExtension;
            params.put("public_id", uniqueFileName);

            // Establecer un nombre fácil de leer en los metadatos de Cloudinary
            Map<String, String> metadata = new HashMap<>();
            metadata.put("original_filename", originalFilename);
            metadata.put("content_type", contentType);
            params.put("context", metadata);

            // Subir el archivo a Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            log.info("Archivo subido con éxito a Cloudinary: {}", secureUrl);

            return new FileUploadResult(
                    secureUrl,
                    publicId,
                    originalFilename,
                    fileType,
                    fileExtension.startsWith(".") ? fileExtension.substring(1) : fileExtension,
                    uniqueFileName);
        } catch (IOException e) {
            log.error("Error al subir archivo a Cloudinary", e);
            throw new RuntimeException("Error al subir archivo: " + e.getMessage());
        }
    }

    // Mantener el método original para compatibilidad
    public String uploadFile(MultipartFile file) {
        return uploadFileWithDetails(file).getUrl();
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

    // Método auxiliar para extraer el public_id de una URL de Cloudinary
    private String extractPublicIdFromUrl(String url) {
        try {
            // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            // o para raw
            // https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{public_id}.{format}

            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1)
                return null;

            String path = url.substring(uploadIndex + 8);

            // En este punto, "path" contendrá algo como:
            // v1747088623/rentary/tenants/documents/filename.pdf
            // o v1747088623/rentary/tenants/images/filename.jpg

            // Extraer el folder y filename del path
            int lastSlashIndex = path.lastIndexOf("/");
            if (lastSlashIndex == -1)
                return path; // No hay carpetas, retornar todo el path

            String folderAndFile = path.substring(0, lastSlashIndex) + "/" + path.substring(lastSlashIndex + 1);

            // Si la URL contiene "/raw/upload/", es un documento PDF u otro archivo raw
            if (url.contains("/raw/upload/")) {
                return folderAndFile;
            }
            // Para imágenes
            else {
                int lastDotIndex = folderAndFile.lastIndexOf(".");
                if (lastDotIndex != -1) {
                    return folderAndFile.substring(0, lastDotIndex);
                } else {
                    return folderAndFile;
                }
            }
        } catch (Exception e) {
            log.error("Error al extraer public_id de URL: {}", url, e);
            return null;
        }
    }

    /**
     * Detecta el tipo de archivo basado en su contentType y nombre de archivo
     */
    private String detectFileType(String contentType, String filename) {
        // Primero intentamos detectar por contentType
        if (contentType != null) {
            if (contentType.contains("pdf") || contentType.equals("application/octet-stream") && filename != null
                    && filename.toLowerCase().endsWith(".pdf")) {
                return "pdf";
            } else if (contentType.contains("jpeg") || contentType.contains("jpg")) {
                return "jpg";
            } else if (contentType.contains("png")) {
                return "png";
            }
        }

        // Si no se pudo detectar por contentType, intentamos por la extensión del
        // archivo
        if (filename != null) {
            String lowerFilename = filename.toLowerCase();
            if (lowerFilename.endsWith(".pdf")) {
                return "pdf";
            } else if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
                return "jpg";
            } else if (lowerFilename.endsWith(".png")) {
                return "png";
            }
        }

        // Si no se pudo detectar
        return "unknown";
    }
}