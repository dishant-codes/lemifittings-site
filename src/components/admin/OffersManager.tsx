import { useState } from "react";
import { useAllOffers, useCreateOffer, useUpdateOffer, useDeleteOffer } from "@/hooks/useOffers";
import { Offer } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";

export function OffersManager() {
  const { data: offers, isLoading } = useAllOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    background_color: "#2d3436",
    text_color: "#ffffff",
    is_active: true,
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      background_color: "#2d3436",
      text_color: "#ffffff",
      is_active: true,
      display_order: offers?.length || 0,
    });
    setEditingOffer(null);
  };

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      subtitle: offer.subtitle || "",
      description: offer.description || "",
      image_url: offer.image_url || "",
      background_color: offer.background_color || "#2d3436",
      text_color: offer.text_color || "#ffffff",
      is_active: offer.is_active,
      display_order: offer.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const offerData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      background_color: formData.background_color,
      text_color: formData.text_color,
      is_active: formData.is_active,
      display_order: formData.display_order,
    };

    try {
      if (editingOffer) {
        await updateOffer.mutateAsync({ id: editingOffer.id, ...offerData });
        toast.success("Offer updated!");
      } else {
        await createOffer.mutateAsync(offerData);
        toast.success("Offer created!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    
    try {
      await deleteOffer.mutateAsync(id);
      toast.success("Offer deleted!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      await updateOffer.mutateAsync({ id: offer.id, is_active: !offer.is_active });
      toast.success(offer.is_active ? "Offer hidden" : "Offer activated");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Offers Carousel</h2>
          <p className="text-muted-foreground">Manage promotional banners shown at the top</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? "Edit Offer" : "Add New Offer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Flat 20% Off"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., On All Door Handles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about the offer"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background_color"
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.background_color}
                      onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text_color"
                      type="color"
                      value={formData.text_color}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.text_color}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div 
                className="rounded-lg p-4 text-center"
                style={{ 
                  backgroundColor: formData.background_color, 
                  color: formData.text_color 
                }}
              >
                <p className="font-bold text-lg">{formData.title || "Title Preview"}</p>
                {formData.subtitle && <p className="opacity-90">{formData.subtitle}</p>}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active (visible on site)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createOffer.isPending || updateOffer.isPending}>
                  {editingOffer ? "Update" : "Create"} Offer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {offers?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No offers yet. Add your first promotional banner!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {offers?.map((offer) => (
            <Card key={offer.id} className={!offer.is_active ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: offer.background_color || "#2d3436" }}
                  >
                    <Megaphone className="w-6 h-6" style={{ color: offer.text_color || "#ffffff" }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{offer.title}</h3>
                      {!offer.is_active && (
                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">Hidden</span>
                      )}
                    </div>
                    {offer.subtitle && (
                      <p className="text-sm text-muted-foreground truncate">{offer.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={offer.is_active}
                      onCheckedChange={() => handleToggleActive(offer)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(offer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(offer.id, offer.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
