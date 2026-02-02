import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validateImageFile,
  createPreviewUrl,
  revokePreviewUrl,
  uploadImageToLocalStorage,
} from "@/lib/imageUpload";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File) => void;
  label?: string;
  disabled?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  onFileSelect,
  label = "Product Image",
  disabled = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      // Upload to local storage and get base64
      const result = await uploadImageToLocalStorage(file);

      if (result.success && result.imagePath) {
        // Create preview URL
        const previewUrl = createPreviewUrl(file);
        setPreview(previewUrl);
        setUploadedFileName(file.name);

        // Store base64 in the form
        onChange(result.imagePath);

        // Call optional callback with file
        onFileSelect?.(file);

        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    if (preview) {
      revokePreviewUrl(preview);
    }
    setPreview(null);
    setUploadedFileName("");
    onChange("");
  };

  const hasImage = value || preview;

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>

      {/* Preview */}
      {hasImage && (
        <div className="relative w-full h-40 rounded-lg border-2 border-dashed bg-muted overflow-hidden">
          <img
            src={preview || value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
          {uploadedFileName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
              {uploadedFileName}
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!hasImage && (
        <div
          onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
          className={cn(
            "relative w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            "bg-muted hover:bg-muted/80 flex items-center justify-center group",
            disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <div className="text-center">
            <Upload className={cn("w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-foreground transition-colors")} />
            <p className="text-sm font-medium">
              {isLoading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF (max 5MB)
            </p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
      />

      {/* Alternative URL Input */}
      <div className="space-y-1">
        <Label htmlFor="image-url" className="text-xs text-muted-foreground">
          Or paste image URL
        </Label>
        <Input
          id="image-url"
          type="url"
          placeholder="https://..."
          value={!preview && typeof value === "string" && !value.startsWith("data:") ? value : ""}
          onChange={(e) => {
            if (!preview && e.target.value && !e.target.value.startsWith("data:")) {
              onChange(e.target.value);
            }
          }}
          disabled={disabled || !!preview}
          className="text-xs"
        />
      </div>

      {/* File Status */}
      {uploadedFileName && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" />
          <span>Image ready to save</span>
        </div>
      )}
    </div>
  );
}
