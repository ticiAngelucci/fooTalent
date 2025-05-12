package BackEnd.Rentary.Common;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

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

    public enum EntityType {
        TENANT("rentary/tenants"),
        CONTRACT("rentary/contracts"),
        PROPERTY("rentary/properties");

        private final String folder;

        EntityType(String folder) {
            this.folder = folder;
        }

        public String getFolder() {
            return folder;
        }
    }

    public enum FileCategory {
        DOCUMENT("documents"),
        IMAGE("images");

        private final String subfolder;

        FileCategory(String subfolder) {
            this.subfolder = subfolder;
        }

        public String getSubfolder() {
            return subfolder;
        }
    }

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

    /**
     * Sube múltiples archivos relacionados con una entidad específica
     *
     * @param files Archivos a subir
     * @param entityType Tipo de entidad (TENANT, CONTRACT, etc.)
     * @param entityId ID de la entidad (para hacer seguimiento)
     * @param identifier Identificador adicional (como DNI, número de contrato)
     * @return Lista de resultados de carga
     */
    public List<FileUploadResult> uploadMultipleFiles(MultipartFile[] files,
                                                      EntityType entityType, String entityId, String identifier) {
        if (files == null || files.length == 0) {
            return Collections.emptyList();
        }

        List<FileUploadResult> results = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                results.add(uploadFileWithDetails(file, entityType, entityId, identifier));
            }
        }

        return results;
    }

    /**
     * Sube un solo archivo con detalles de la entidad asociada
     */
    public FileUploadResult uploadFileWithDetails(MultipartFile file, EntityType entityType,
                                                  String entityId, String identifier) {
        try {
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();

            log.info("Subiendo archivo: {} con tipo de contenido: {} para entidad: {}",
                    originalFilename, contentType, entityType);

            // Determinar un nombre "limpio" para el archivo
            String cleanFileName = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_")
                    : "archivo";

            // Extraer la extensión del archivo original
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                cleanFileName = cleanFileName.substring(0, cleanFileName.lastIndexOf("."));
            } else {
                // Si no hay extensión, intentar determinarla por el contentType
                fileExtension = determineFileExtension(contentType);
            }

            // Determinar categoría y tipo de archivo
            FileCategory fileCategory;
            String fileType;
            Map<String, Object> params;

            // Verificar si el archivo es una imagen o un PDF
            boolean isImage = isImageFile(contentType, fileExtension);
            boolean isPdf = isPdfFile(contentType, fileExtension);

            if (isImage) {
                fileCategory = FileCategory.IMAGE;
                fileType = "image";
                params = ObjectUtils.asMap("folder", buildFolderPath(entityType, fileCategory));
            } else if (isPdf) {
                fileCategory = FileCategory.DOCUMENT;
                fileType = "document";
                params = ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", buildFolderPath(entityType, fileCategory));
            } else {
                throw new IllegalArgumentException(
                        "Tipo de archivo no permitido. Solo se permiten PDF e imágenes (JPG, PNG). Tipo detectado: "
                                + contentType);
            }

            // Generar nombre único para el archivo
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            String shortOriginalName = cleanFileName.length() > 10 ? cleanFileName.substring(0, 10) : cleanFileName;
            String cleanIdentifier = identifier != null ? identifier.replaceAll("[^a-zA-Z0-9]", "") : "noID";
            String entityIdClean = entityId != null ? entityId.replaceAll("[^a-zA-Z0-9]", "") : "noID";

            String uniqueFileName = shortOriginalName + "_id" + entityIdClean +
                    "_" + cleanIdentifier + "_" + uniqueId + fileExtension;
            params.put("public_id", uniqueFileName);

            // Metadatos
            Map<String, String> metadata = new HashMap<>();
            metadata.put("original_filename", originalFilename);
            metadata.put("content_type", contentType);
            metadata.put("entity_id", entityId);
            metadata.put("identifier", identifier);
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

    /**
     * Elimina múltiples archivos por sus publicIds
     */
    public void deleteMultipleFiles(List<String> publicIds) {
        if (publicIds == null || publicIds.isEmpty()) {
            return;
        }

        for (String publicId : publicIds) {
            if (publicId != null && !publicId.isEmpty()) {
                try {
                    deleteFile(publicId);
                } catch (Exception e) {
                    log.warn("Error al eliminar archivo {}: {}", publicId, e.getMessage());
                }
            }
        }
    }

    /**
     * Elimina un archivo por su publicId
     */
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Archivo eliminado con éxito de Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Error al eliminar archivo de Cloudinary", e);
            throw new RuntimeException("Error al eliminar archivo: " + e.getMessage());
        }
    }

    /**
     * Extrae el public_id de una URL de Cloudinary
     */
    public String extractPublicIdFromUrl(String url) {
        try {
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1)
                return null;

            String path = url.substring(uploadIndex + 8);

            // Extraer el folder y filename del path
            int lastSlashIndex = path.lastIndexOf("/");
            if (lastSlashIndex == -1)
                return path; // No hay carpetas, retornar todo el path

            String folderAndFile = path.substring(0, lastSlashIndex + 1) + path.substring(lastSlashIndex + 1);

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

    // Métodos auxiliares
    private String buildFolderPath(EntityType entityType, FileCategory fileCategory) {
        return entityType.getFolder() + "/" + fileCategory.getSubfolder();
    }

    private String determineFileExtension(String contentType) {
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

    private boolean isPdfFile(String contentType, String fileExtension) {
        return (contentType != null && Arrays.asList(ACCEPTED_PDF_TYPES).contains(contentType)) ||
                (fileExtension != null && fileExtension.equalsIgnoreCase(".pdf"));
    }

    private boolean isImageFile(String contentType, String fileExtension) {
        return (contentType != null && Arrays.asList(ACCEPTED_IMAGE_TYPES).contains(contentType)) ||
                (fileExtension != null && (fileExtension.equalsIgnoreCase(".jpg") ||
                        fileExtension.equalsIgnoreCase(".jpeg") ||
                        fileExtension.equalsIgnoreCase(".png")));
    }
}