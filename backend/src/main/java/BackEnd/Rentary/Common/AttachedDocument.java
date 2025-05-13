package BackEnd.Rentary.Common;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachedDocument {
    @Column(name = "document_id", length = 36)
    private String id = UUID.randomUUID().toString();
    @Column(name = "document_url", length = 500)
    private String url;

    @Column(name = "document_public_id", length = 255)
    private String publicId;

    @Column(name = "document_name", length = 255)
    private String originalName;

    @Column(name = "document_type", length = 50)
    private String fileType;

    @Column(name = "document_extension", length = 10)
    private String extension;

    @Column(name = "document_description", length = 255)
    private String description;
}