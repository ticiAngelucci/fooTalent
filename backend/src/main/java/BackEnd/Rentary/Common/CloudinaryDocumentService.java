package BackEnd.Rentary.Common;

import org.springframework.web.multipart.MultipartFile;

public class CloudinaryDocumentService implements DocumentService{
    @Override
    public DocumentInfo uploadDocument(MultipartFile file, String entityType, String entityId, String extraInfo) {
        return null;
    }

    @Override
    public boolean deleteDocument(String publicId) {
        return false;
    }

    @Override
    public String extractPublicIdFromUrl(String url) {
        return "";
    }
}
