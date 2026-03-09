import { useState, useRef, useCallback } from "react";
import { Upload, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function UploadZone({ onFileSelect, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".apk")) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300",
        "bg-card/50 hover:bg-card/80",
        isDragging ? "border-primary glow-primary bg-primary/5" : "border-border hover:border-primary/50",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="scanline absolute inset-0" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".apk"
        onChange={handleChange}
        className="hidden"
      />

      <div className="relative flex flex-col items-center gap-4">
        {isUploading ? (
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        ) : (
          <div className="relative">
            <Shield className="h-16 w-16 text-primary" />
            <Upload className="absolute -bottom-1 -right-1 h-6 w-6 text-accent" />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {isUploading ? "Analyzing APK..." : "Drop your APK here"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            {isUploading ? "Scanning permissions, network indicators & malware patterns" : "or click to browse • max 100MB"}
          </p>
        </div>

        {!isUploading && (
          <Button variant="outline" className="mt-2 font-mono border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
            SELECT APK FILE
          </Button>
        )}
      </div>
    </div>
  );
}
