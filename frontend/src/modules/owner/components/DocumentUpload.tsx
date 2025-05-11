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

const MAX_FILES = 7;

const DocumentUpload = () => {
  const { control, setValue } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (files.length + newFiles.length > MAX_FILES) {
      setHasReachedLimit(true);
      setTimeout(() => setHasReachedLimit(false), 4000);
    }
    const totalFiles = [...files, ...newFiles].slice(0, MAX_FILES);
    setFiles(totalFiles);
    setValue("file", totalFiles); // en RHF, solo guardamos si querés subir todos en backend
  };

  const handleRemove = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    setValue("file", updated.length ? updated : undefined);
  };

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between border rounded-md p-3 "
        >
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
            <a
              href={URL.createObjectURL(file)}
              download={file.name}
              className="text-blue-700"
            >
              <DownloadIcon size={18} />
            </a>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-600"
            >
              <Trash2Icon size={18} />
            </button>
          </div>
        </div>
      ))}

      {files.length < MAX_FILES && (
        <FormField
          control={control}
          name="file"
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
                    {files.length === 0 ? "Ningún archivo seleccionado" : `${files.length} archivo(s) seleccionado(s)`}
                  </span>
                  <input
                    id="custom-file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    name={name}
                    ref={ref}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </FormControl>
              <FormMessage />
              {hasReachedLimit && (
                <p className="text-xs text-red-600 mt-1">
                  Solo se pueden subir hasta 7 archivos.
                </p>
              )}
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default DocumentUpload;