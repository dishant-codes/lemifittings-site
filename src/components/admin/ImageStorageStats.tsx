import { useLocalImageStorage } from "@/hooks/useLocalImageStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HardDrive, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ImageStorageStats() {
  const {
    storageUsage,
    imageCount,
    clearAllImages,
    formatStorageSize,
    calculateStorageUsage,
  } = useLocalImageStorage();

  const handleClearAll = () => {
    if (clearAllImages()) {
      toast.success("All images cleared from storage");
    } else {
      toast.error("Failed to clear images");
    }
  };

  const storageLimit = 5 * 1024 * 1024; // 5MB - typical browser quota
  const usagePercent = Math.round((storageUsage / storageLimit) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          Image Storage Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Storage Used</span>
            <span className="font-medium">{formatStorageSize(storageUsage)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{usagePercent}% used</span>
            <span>~{formatStorageSize(storageLimit)} limit</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Images</div>
            <div className="text-lg font-semibold">{imageCount}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Available</div>
            <div className="text-lg font-semibold">
              {formatStorageSize(Math.max(0, storageLimit - storageUsage))}
            </div>
          </div>
        </div>

        {usagePercent > 80 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-900">
            ⚠️ Storage is running low. Consider clearing unused images.
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={calculateStorageUsage}
            className="flex-1"
          >
            Refresh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-2"
                disabled={imageCount === 0}
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Images?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all {imageCount} stored images. This action cannot be undone.
                  Products will show broken image icons until new images are uploaded.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>💡 <strong>Tip:</strong> Images are stored locally in your browser.</p>
          <p>🔄 Data persists across sessions and page refreshes.</p>
          <p>🗑️ Clearing browser storage will delete all images.</p>
        </div>
      </CardContent>
    </Card>
  );
}
