package BackEnd.Rentary.Common.Service;

import BackEnd.Rentary.Common.DocumentUploadResult;
import BackEnd.Rentary.Common.Enums.EntityType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface FileUploadService {


    List<DocumentUploadResult> uploadMultipleFiles(MultipartFile[] files,
                                                   EntityType entityType,
                                                   String entityId,
                                                   String identifier);

    DocumentUploadResult uploadFile(MultipartFile file,
                                    EntityType entityType,
                                    String entityId,
                                    String identifier);


    void deleteMultipleFiles(List<String> publicIds);

    void deleteFile(String publicId);


    String extractPublicIdFromUrl(String url);
}