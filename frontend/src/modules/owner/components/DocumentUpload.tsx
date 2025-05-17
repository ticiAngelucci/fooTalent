import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { useState } from "react";
import { DownloadIcon, Trash2Icon, File } from "lucide-react";
import { DocumentFromAPI } from "@/shared/interfaces/documentInterface";

interface Props {
  documents?: DocumentFromAPI[];
}

const DocumentUpload = ({ documents }: Props) => {
  const { control, setValue } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const combinedFiles = [...files, ...selectedFiles];

    const limitedFiles = combinedFiles.slice(0, 4);
    setFiles(limitedFiles);
    setValue("attachedDocument", limitedFiles);
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setValue("files", updatedFiles.length ? updatedFiles : undefined);
  };

  return (
    <div className="space-y-4">
      {documents && documents.length > 0 &&
        documents.map((doc) => {
          const isPDF = doc.extension.toLowerCase() === "pdf";
          return (
            <div
              key={`doc-${doc.id}`}
              className="flex items-center justify-between border rounded-md p-3"
            >
              <div className="flex items-center gap-3">
                <File className="text-green-700" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{doc.originalName}</span>
                  <span className="text-xs text-gray-500 uppercase">{doc.extension}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPDF ? (
                  <a
                    href={doc.url}
                    download={doc.originalName}
                    className="text-blue-700"
                  >
                    <DownloadIcon size={18} />
                  </a>
                ) : (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700"
                  >
                    <DownloadIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          );
        })}


      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between border rounded-md p-3">
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

      {files.length < 4 && (
        <FormField
          control={control}
          name="attachedDocument"
          render={({ field: { name, ref } }) => (
            <FormItem>
              <FormLabel>Añadir documentos</FormLabel>
              <FormControl>
                <label
                  htmlFor="custom-file-upload"
                  className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span className="text-blue-700 font-semibold">Subir archivo</span>
                  <span>
                    {files.length > 0
                      ? `${files.length} archivo(s) seleccionado(s)`
                      : "Ningún archivo seleccionado"}
                  </span>
                  <input
                    id="custom-file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple={false}
                    name={name}
                    ref={ref}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {files.length >= 4 && (
        <p className="text-sm text-neutral-900">
          Has alcanzado el máximo de 4 archivos.
        </p>
      )}
    </div>
  );
};

export default DocumentUpload;