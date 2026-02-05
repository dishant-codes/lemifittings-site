import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { Product, SizePrice } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/ImageUploadField";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GripVertical, Package, X, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    short_description: "",
    price: 0,
    size_prices: [] as SizePrice[],
    category: "",
    finishes: "",
    sizes: "",
    packaging_box: 1,
    product_images: [] as string[],
    is_new: false,
    is_bestseller: false,
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      short_description: "",
      price: 0,
      size_prices: [],
      category: "",
      finishes: "",
      sizes: "",
      packaging_box: 1,
      product_images: [],
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
      short_description: product.short_description || "",
      price: product.price,
      size_prices: product.size_prices || [],
      category: product.category,
      finishes: product.finishes.join(", "),
      sizes: product.sizes?.join(", ") || "",
      packaging_box: product.packaging_box,
      product_images: product.product_images || [],
      is_new: product.is_new,
      is_bestseller: product.is_bestseller,
      display_order: product.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.product_images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description || null,
      short_description: formData.short_description || null,
      price: formData.price,
      size_prices: formData.size_prices.length > 0 ? formData.size_prices : null,
      category: formData.category,
      finishes: formData.finishes.split(",").map(f => f.trim()).filter(Boolean),
      sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(Boolean) : null,
      packaging_box: formData.packaging_box,
      product_images: formData.product_images,
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

  const addProductImage = (imageUrl: string) => {
    if (!imageUrl) return;
    setFormData(prev => ({
      ...prev,
      product_images: [...prev.product_images, imageUrl]
    }));
    toast.success("Image added");
  };

  const removeProductImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index)
    }));
    toast.success("Image removed");
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.product_images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setFormData(prev => ({ ...prev, product_images: newImages }));
  };

  const moveImageDown = (index: number) => {
    if (index === formData.product_images.length - 1) return;
    const newImages = [...formData.product_images];
    [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    setFormData(prev => ({ ...prev, product_images: newImages }));
  };

  const addSizePrice = () => {
    setFormData(prev => ({
      ...prev,
      size_prices: [...prev.size_prices, { size: "", price: 0 }]
    }));
  };

  const updateSizePrice = (index: number, field: 'size' | 'price', value: string | number) => {
    setFormData(prev => {
      const newSizePrices = [...prev.size_prices];
      newSizePrices[index] = {
        ...newSizePrices[index],
        [field]: value
      };
      return { ...prev, size_prices: newSizePrices };
    });
  };

  const removeSizePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      size_prices: prev.size_prices.filter((_, i) => i !== index)
    }));
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="BT-714 Knob"
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
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed product description for product details page"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description *</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief description for product listing (50-100 characters)"
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Pricing</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Base Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="190"
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

                {/* Size-Based Pricing */}
                <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-sm">Size-Based Pricing (Optional)</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addSizePrice}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Size Price
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set different prices for different sizes. Users will see prices change when they select a size.
                  </p>

                  {formData.size_prices.length > 0 && (
                    <div className="space-y-2">
                      {formData.size_prices.map((sizePrice, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-white p-2 rounded border">
                          <div className="flex-1">
                            <Label className="text-xs">Size</Label>
                            <Input
                              type="text"
                              placeholder='e.g., 4", 6"'
                              value={sizePrice.size}
                              onChange={(e) => updateSizePrice(idx, 'size', e.target.value)}
                              className="mt-1 text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs">Price (₹)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={sizePrice.price}
                              onChange={(e) => updateSizePrice(idx, 'price', Number(e.target.value))}
                              className="mt-1 text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSizePrice(idx)}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 border-b pb-4">
                <h3 className="font-semibold text-sm">Specifications</h3>
                
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
                    <Label htmlFor="sizes">Available Sizes (comma-separated)</Label>
                    <Input
                      id="sizes"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder='4", 6", 8"'
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-4 border-b pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Product Images *</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {formData.product_images.length} image(s)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload multiple images of your product. First image will be used as default on listing page.
                </p>

                <div className="space-y-2">
                  <div>
                    <ImageUploadField
                      value=""
                      onChange={(url) => {
                        addProductImage(url);
                      }}
                      disabled={createProduct.isPending || updateProduct.isPending}
                    />
                  </div>
                </div>

                {/* Image Gallery */}
                {formData.product_images.length > 0 && (
                  <div className="border rounded-lg p-3 space-y-2 bg-gray-50 max-w-full overflow-hidden">
                    {formData.product_images.map((image, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                        <img 
                          src={image} 
                          alt={`Product ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">Image {idx + 1}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => moveImageUp(idx)}
                            disabled={idx === 0}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => moveImageDown(idx)}
                            disabled={idx === formData.product_images.length - 1}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProductImage(idx)}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flags */}
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

              <div className="flex justify-end gap-2 pt-4 border-t">
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
                    {product.product_images && product.product_images.length > 0 ? (
                      <img src={product.product_images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
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
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-medium">₹{product.price}/pc</p>
                      {product.product_images && product.product_images.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {product.product_images.length} image(s)
                        </span>
                      )}
                    </div>
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
