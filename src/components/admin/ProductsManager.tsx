import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/ImageUploadField";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductsManager() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    finishes: "",
    sizes: "",
    packaging_box: 1,
    image_url: "",
    is_new: false,
    is_bestseller: false,
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      finishes: "",
      sizes: "",
      packaging_box: 1,
      image_url: "",
      is_new: false,
      is_bestseller: false,
      display_order: products?.length || 0,
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      finishes: product.finishes.join(", "),
      sizes: product.sizes?.join(", ") || "",
      packaging_box: product.packaging_box,
      image_url: product.image_url || "",
      is_new: product.is_new,
      is_bestseller: product.is_bestseller,
      display_order: product.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      category: formData.category,
      finishes: formData.finishes.split(",").map(f => f.trim()).filter(Boolean),
      sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : null,
      packaging_box: formData.packaging_box,
      image_url: formData.image_url || null,
      is_new: formData.is_new,
      is_bestseller: formData.is_bestseller,
      display_order: formData.display_order,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(productData);
        toast.success("Product created!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMoveUp = async (product: Product, index: number) => {
    if (index === 0 || !products) return;
    const prevProduct = products[index - 1];
    
    try {
      await updateProduct.mutateAsync({ id: product.id, display_order: prevProduct.display_order });
      await updateProduct.mutateAsync({ id: prevProduct.id, display_order: product.display_order });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleMoveDown = async (product: Product, index: number) => {
    if (!products || index === products.length - 1) return;
    const nextProduct = products[index + 1];
    
    try {
      await updateProduct.mutateAsync({ id: product.id, display_order: nextProduct.display_order });
      await updateProduct.mutateAsync({ id: nextProduct.id, display_order: product.display_order });
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
          <h2 className="text-2xl font-display font-bold">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Door Handles"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packaging_box">Pcs per Box *</Label>
                  <Input
                    id="packaging_box"
                    type="number"
                    min="1"
                    value={formData.packaging_box}
                    onChange={(e) => setFormData({ ...formData, packaging_box: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="finishes">Finishes (comma-separated) *</Label>
                  <Input
                    id="finishes"
                    value={formData.finishes}
                    onChange={(e) => setFormData({ ...formData, finishes: e.target.value })}
                    placeholder="SS, AB, BLACK, CP"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder='4", 6", 8"'
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Product Image</Label>
                <ImageUploadField
                  value={formData.image_url}
                  onChange={(value) => setFormData({ ...formData, image_url: value })}
                  disabled={createProduct.isPending || updateProduct.isPending}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                  />
                  <Label htmlFor="is_new">Mark as New</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_bestseller: checked })}
                  />
                  <Label htmlFor="is_bestseller">Bestseller</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products yet. Add your first product!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {products?.map((product, index) => (
            <Card key={product.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(product, index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveDown(product, index)}
                      disabled={index === (products?.length || 0) - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      {product.is_new && (
                        <span className="px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded">New</span>
                      )}
                      {product.is_bestseller && (
                        <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded">Bestseller</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{product.category}</p>
                    <p className="text-sm font-medium">₹{product.price}/pc</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id, product.name)}
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
