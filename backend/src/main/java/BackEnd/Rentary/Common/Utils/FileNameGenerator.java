package BackEnd.Rentary.Common.Utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;


@Component
@Slf4j
public class FileNameGenerator {


    public String generateUniqueFileName(String originalName, String entityId, String identifier) {
        String cleanName = cleanFileName(originalName);
        String fileExtension = extractFileExtension(originalName);

        String shortName = truncateFileName(cleanName, 10);
        String cleanIdentifier = sanitizeString(identifier, "noID");
        String cleanEntityId = sanitizeString(entityId, "noID");
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);

        return shortName + "_id" + cleanEntityId + "_" + cleanIdentifier + "_" + uniqueId + fileExtension;
    }


    public String cleanFileName(String fileName) {
        if (fileName == null) {
            return "archivo";
        }

        if (fileName.contains(".")) {
            return fileName.substring(0, fileName.lastIndexOf(".")).replaceAll("[^a-zA-Z0-9.-]", "_");
        }

        return fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
    }


    public String extractFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf("."));
        }
        return "";
    }


    private String truncateFileName(String fileName, int maxLength) {
        if (fileName == null) {
            return "";
        }
        return fileName.length() > maxLength ? fileName.substring(0, maxLength) : fileName;
    }


    private String sanitizeString(String input, String defaultValue) {
        if (input == null || input.trim().isEmpty()) {
            return defaultValue;
        }
        return input.replaceAll("[^a-zA-Z0-9]", "");
    }
}