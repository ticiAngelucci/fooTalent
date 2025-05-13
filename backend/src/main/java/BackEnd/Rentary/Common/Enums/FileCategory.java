package BackEnd.Rentary.Common.Enums;


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