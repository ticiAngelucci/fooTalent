package BackEnd.Rentary.Common.DTOs;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private String id;
    private String url;
    private String publicId;
    private String originalName;
    private String fileType;
    private String extension;
}