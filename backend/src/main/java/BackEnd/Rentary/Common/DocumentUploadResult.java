package BackEnd.Rentary.Common;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class DocumentUploadResult {
    private String url;
    private String publicId;
    private String originalName;
    private String fileType;
    private String extension;
    private String uniqueName;
}