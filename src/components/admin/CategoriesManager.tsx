import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/ImageUploadField";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import type { Category } from "@/hooks/useCategories";

export function CategoriesManager() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    id: "",
    image: "",
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      id: "",
      image: "",
      display_order: categories.length,
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image || "",
      display_order: category.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!formData.id.trim()) {
      toast.error("Category ID is required");
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          name: formData.name,
          description: formData.description,
          image: formData.image || null,
          display_order: formData.display_order,
        });
        toast.success("Category updated!");
      } else {
        // Create new category
        await createCategory.mutateAsync({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          image: formData.image || null,
          display_order: formData.display_order,
        });
        toast.success("Category created!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Delete "${name}"? Products using this category will still reference it.`
      )
    ) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success("Category deleted!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete category");
      }
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Categories</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage product categories with images
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="gap-2">
              <Plus className="w-4 h-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category ID */}
              <div className="space-y-2">
                <Label htmlFor="id">Category ID (slug)</Label>
                <Input
                  id="id"
                  placeholder="e.g., wooden-handles"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  disabled={!!editingCategory}
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the category (cannot be changed after creation)
                </p>
              </div>

              {/* Category Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Wooden Handles"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Category Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a brief description of this category"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Category Image */}
              <div className="space-y-3 border-t pt-4">
                <Label>Category Image (Optional)</Label>
                <ImageUploadField
                  value=""
                  onChange={(url) => {
                    setFormData({ ...formData, image: url });
                    toast.success("Image added");
                  }}
                />
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="relative inline-block">
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createCategory.isPending || updateCategory.isPending}>
                  {editingCategory ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {category.id}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
              {category.image && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">Image:</p>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No categories yet</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tip:</span> Add category images to make your category cards more visually appealing. Images will be displayed on the website's category section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
