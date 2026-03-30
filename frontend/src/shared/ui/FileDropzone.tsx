import { useState } from "react";
import { cn } from "@heroui/styles";
import { Upload } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string[];
}

export const FileDropzone = ({ onFileSelect, accept }: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all",
        "border-gray-300 text-default-foreground",
        isDragging && "border-accent bg-accent/5 text-accent",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Upload size={40} className="text-gray-500" />

      <div className="text-center">
        <p>
          Перетащите файл сюда или{" "}
          <span className="text-accent">нажмите для выбора</span>
        </p>

        {accept && (
          <p className="text-sm text-default-foreground/80 mt-1">
            Поддерживаемые форматы: {accept.join(", ")}
          </p>
        )}
      </div>

      <input
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={accept?.join(",")}
      />
    </label>
  );
};
