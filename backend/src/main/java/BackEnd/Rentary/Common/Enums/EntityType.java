package BackEnd.Rentary.Common.Enums;

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