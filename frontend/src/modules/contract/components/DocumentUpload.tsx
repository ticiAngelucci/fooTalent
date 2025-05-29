import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { DownloadIcon, Trash2Icon, File } from "lucide-react";
import { deleteDocumentFromContract } from "../services/deleteDocumentService";

export type ExistingDoc = {
  id: string;
  fileName: string;
  url: string;
};

interface DocumentUploadProps {
  existingDocs?: ExistingDoc[];
  contractId?: number;
}

const MAX_TOTAL = 6;

export const DocumentUpload = ({ existingDocs = [], contractId }: DocumentUploadProps) => {
  const { control } = useFormContext();
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [docsFromDb, setDocsFromDb] = useState<ExistingDoc[]>(existingDocs);

  const remainingSlots = MAX_TOTAL - (docsFromDb.length + localFiles.length);

  return (
    <Controller
      name="documents"
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const files = localFiles.length ? localFiles : field.value ?? [];

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const incoming = e.target.files ? Array.from(e.target.files) : [];
          const allowed = incoming.slice(0, remainingSlots);
          const merged = [...files, ...allowed];
          field.onChange(merged);
          setLocalFiles(merged);
        };

        const handleRemove = (index: number) => {
          const updated = files.filter((_, i) => i !== index);
          field.onChange(updated);
          setLocalFiles(updated);
        };


        return (
          <FormItem className="space-y-4">
            {docsFromDb.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border rounded-md p-3 bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <File className="text-blue-700" />
                  <span className="text-sm font-medium max-w-[180px] truncate">
                    {doc.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700"
                  >
                    <DownloadIcon size={18} />
                  </a>
                  {/* <button
                    type="button"
                    onClick={() => handleDeleteFromDb(doc.id)}
                    className="text-red-600"
                  >
                    <Trash2Icon size={18} />
                  </button> */}
                </div>
              </div>
            ))}

            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-md p-3 h-16"
              >
                <div className="flex items-center gap-3">
                  <File className="text-brand-700" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium max-w-[180px] truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(1)} Mb
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button">
                    <DownloadIcon className="text-brand-800" size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-600 mr-6"
                  >
                    <Trash2Icon size={24} />
                  </button>
                </div>
              </div>
            ))}

            {remainingSlots > 0 && (
              <FormControl>
                <label
                  htmlFor="document-upload-input"
                  className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-500 hover:bg-gray-50"
                >
                  <span className="text-blue-700 font-semibold">Subir archivo</span>
                  <span>
                    {files.length > 0
                      ? `${files.length} archivo(s) seleccionado(s)`
                      : "Ningún archivo seleccionado"}
                  </span>
                  <Input
                    id="document-upload-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>
              </FormControl>
            )}

            {remainingSlots === 0 && (
              <p className="text-sm text-neutral-900">
                Has alcanzado el máximo de {MAX_TOTAL} archivos (incluyendo los ya cargados).
              </p>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DocumentUpload;
