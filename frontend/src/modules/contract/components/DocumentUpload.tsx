import { Dispatch, SetStateAction } from "react";
import { DownloadIcon, Trash2Icon, File } from "lucide-react";

interface ExistingDocument {
  id: string;
  originalName: string;
  url: string;
  fileType: string;
  size?: number; // opcional por si backend lo manda
}

interface DocumentUploadProps {
  documents: File[];
  setDocuments: Dispatch<SetStateAction<File[]>>;
  existingDocuments?: ExistingDocument[];
  onRemoveExisting?: (id: string) => void;
}

const DocumentUpload = ({
  documents,
  setDocuments,
  existingDocuments = [],
  onRemoveExisting,
}: DocumentUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const combinedFiles = [...documents, ...selectedFiles];
    const limitedFiles = combinedFiles.slice(0, 4);
    setDocuments(limitedFiles);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = documents.filter((_, i) => i !== index);
    setDocuments(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {existingDocuments.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
          <div className="flex items-center gap-3">
            <File className="text-blue-700" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{doc.originalName}</span>
              <span className="text-xs text-gray-500">
                {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} Mb` : doc.fileType}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-700">
              <DownloadIcon size={18} />
            </a>
            {onRemoveExisting && (
              <button type="button" onClick={() => onRemoveExisting(doc.id)} className="text-red-600">
                <Trash2Icon size={18} />
              </button>
            )}
          </div>
        </div>
      ))}

      {documents.map((file, index) => (
        <div key={file.name + index} className="flex items-center justify-between border rounded-md p-3">
          <div className="flex items-center gap-3">
            <File className="text-blue-700" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(1)} Mb
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={URL.createObjectURL(file)} download={file.name} className="text-blue-700">
              <DownloadIcon size={18} />
            </a>
            <button type="button" onClick={() => handleRemove(index)} className="text-red-600">
              <Trash2Icon size={18} />
            </button>
          </div>
        </div>
      ))}

      {documents.length + existingDocuments.length < 4 && (
        <div className="mt-4">
          <label
            htmlFor="custom-file-upload"
            className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-500 hover:bg-gray-50"
          >
            <span className="text-blue-700 font-semibold">Subir archivo</span>
            <span>
              {documents.length > 0
                ? `${documents.length} archivo(s) nuevo(s)`
                : "Ningún archivo seleccionado"}
            </span>
            <input
              id="custom-file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
