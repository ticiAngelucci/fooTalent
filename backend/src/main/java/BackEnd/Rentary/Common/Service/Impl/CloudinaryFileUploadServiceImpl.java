package BackEnd.Rentary.Common.Service.Impl;

import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import BackEnd.Rentary.Common.Enums.FileCategory;
import BackEnd.Rentary.Common.Service.FileUploadService;
import BackEnd.Rentary.Common.Utils.FileNameGenerator;
import BackEnd.Rentary.Common.Utils.FileValidator;
import BackEnd.Rentary.Exceptions.FileUploadException;
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
public class CloudinaryFileUploadServiceImpl implements FileUploadService {
    private final Cloudinary cloudinary;
    private final FileValidator fileValidator;
    private final FileNameGenerator fileNameGenerator;

    @Override
    public List<DocumentUploadResult> uploadMultipleFiles(MultipartFile[] files,
            EntityType entityType, String entityId, String identifier) {
        if (files == null || files.length == 0) {
            return Collections.emptyList();
        }

        List<DocumentUploadResult> results = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                results.add(uploadFile(file, entityType, entityId, identifier));
            }
        }

        return results;
    }

    @Override
    public DocumentUploadResult uploadFile(MultipartFile file, EntityType entityType,
            String entityId, String identifier) {
        try {
            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename();

            log.info("Subiendo archivo: {} con tipo de contenido: {} para entidad: {}",
                    originalFilename, contentType, entityType);

            String fileExtension = fileNameGenerator.extractFileExtension(originalFilename);
            if (fileExtension.isEmpty()) {
                fileExtension = fileValidator.determineFileExtension(contentType);
            }

            FileCategory fileCategory = fileValidator.determineFileCategory(contentType, fileExtension);
            String fileType = fileCategory == FileCategory.IMAGE ? "image" : "document";

            String uniqueFileName = fileNameGenerator.generateUniqueFileName(originalFilename, entityId, identifier);

            Map<String, Object> params = prepareUploadParams(fileCategory, entityType, uniqueFileName,
                    originalFilename, contentType, entityId, identifier);

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            log.info("Archivo subido con éxito a Cloudinary: {}", secureUrl);

            return DocumentUploadResult.builder()
                    .url(secureUrl)
                    .publicId(publicId)
                    .originalName(originalFilename)
                    .fileType(fileType)
                    .extension(fileExtension.startsWith(".") ? fileExtension.substring(1) : fileExtension)
                    .uniqueName(uniqueFileName)
                    .build();

        } catch (IOException e) {
            log.error("Error al subir archivo a Cloudinary", e);
            throw new FileUploadException("Error al subir archivo: " + e.getMessage());
        }
    }

    @Override
    public void deleteMultipleFiles(List<String> publicIds) {
        if (publicIds == null || publicIds.isEmpty()) {
            return;
        }

        // Separar los IDs por tipo para eliminarlos por lotes cuando sea posible
        List<String> imagePublicIds = new ArrayList<>();
        List<String> pdfPublicIds = new ArrayList<>();

        for (String publicId : publicIds) {
            if (publicId == null || publicId.isEmpty()) {
                continue;
            }

            // Clasificar los publicIds por tipo
            boolean isPdfFile = publicId.contains("/documents/") || publicId.endsWith(".pdf");
            if (isPdfFile) {
                pdfPublicIds.add(publicId);
            } else {
                imagePublicIds.add(publicId);
            }
        }

        // Eliminar imágenes
        for (String imageId : imagePublicIds) {
            try {
                cloudinary.uploader().destroy(imageId, ObjectUtils.emptyMap());
                log.info("Imagen eliminada con éxito: {}", imageId);
            } catch (Exception e) {
                log.warn("Error al eliminar imagen {}: {}", imageId, e.getMessage());
            }
        }

        // Eliminar PDFs
        Map<String, Object> rawOptions = ObjectUtils.asMap("resource_type", "raw");
        for (String pdfId : pdfPublicIds) {
            try {
                cloudinary.uploader().destroy(pdfId, rawOptions);
                log.info("PDF eliminado con éxito: {}", pdfId);
            } catch (Exception e) {
                log.warn("Error al eliminar PDF {}: {}", pdfId, e.getMessage());
            }
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            // Determinar si es un documento PDF basado en el publicId
            boolean isPdfFile = publicId != null &&
                    (publicId.contains("/documents/") || publicId.endsWith(".pdf"));

            Map<String, Object> options = new HashMap<>();

            // Configurar opciones específicas si es un archivo raw (PDF)
            if (isPdfFile) {
                options.put("resource_type", "raw");
            }

            cloudinary.uploader().destroy(publicId, options);
            log.info("Archivo eliminado con éxito de Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Error al eliminar archivo de Cloudinary: {}. Error: {}", publicId, e.getMessage());
            throw new RuntimeException("Error al eliminar archivo: " + e.getMessage());
        }
    }

    @Override
    public String extractPublicIdFromUrl(String url) {
        try {
            // Detectar si es un archivo raw (como PDF)
            boolean isRawFile = url.contains("/raw/upload/");

            // El índice de upload varía dependiendo si es raw o no
            String uploadPattern = isRawFile ? "/raw/upload/" : "/upload/";
            int uploadIndex = url.indexOf(uploadPattern);

            if (uploadIndex == -1)
                return null;

            // Para archivos raw, necesitamos tomar la URL después de "/raw/upload/"
            String path = isRawFile ? url.substring(uploadIndex + uploadPattern.length())
                    : url.substring(uploadIndex + uploadPattern.length());

            // Extraer el folder y filename del path
            int lastSlashIndex = path.lastIndexOf("/");
            if (lastSlashIndex == -1)
                return path; // No hay carpetas, retornar todo el path

            String folderAndFile = path.substring(0, path.lastIndexOf("/") + 1) +
                    path.substring(path.lastIndexOf("/") + 1);

            // Si es un archivo raw (PDF), mantener la extensión en el publicId
            if (isRawFile) {
                return folderAndFile;
            }
            // Para imágenes, quitar la extensión
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

    private String buildFolderPath(EntityType entityType, FileCategory fileCategory) {
        return entityType.getFolder() + "/" + fileCategory.getSubfolder();
    }

    private Map<String, Object> prepareUploadParams(
            FileCategory fileCategory,
            EntityType entityType,
            String uniqueFileName,
            String originalFilename,
            String contentType,
            String entityId,
            String identifier) {

        Map<String, Object> params;

        if (fileCategory == FileCategory.IMAGE) {
            params = ObjectUtils.asMap(
                    "folder", buildFolderPath(entityType, fileCategory),
                    "public_id", uniqueFileName);
        } else {
            params = ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", buildFolderPath(entityType, fileCategory),
                    "public_id", uniqueFileName);
        }

        Map<String, String> metadata = new HashMap<>();
        metadata.put("original_filename", originalFilename);
        metadata.put("content_type", contentType);
        metadata.put("entity_id", entityId);
        metadata.put("identifier", identifier);
        params.put("context", metadata);

        return params;
    }
}