package BackEnd.Rentary.Common;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {
    DocumentInfo uploadDocument(MultipartFile file, String entityType, String entityId, String extraInfo);
    boolean deleteDocument(String publicId);
    String extractPublicIdFromUrl(String url);
}


