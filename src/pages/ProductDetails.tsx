import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Package, Share2, Check, ChevronRight, ChevronDown, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProductById } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "+919321768154";

// Helper function to get color from finish name
const getFinishColor = (finish: string): string => {
  const colorMap: Record<string, string> = {
    "SS": "bg-slate-300",
    "CP": "bg-gray-400",
    "Matt": "bg-gray-500",
    "AB": "bg-amber-800",
    "RG": "bg-rose-400",
    "Graphite": "bg-gray-700",
    "Gold": "bg-yellow-500",
    "Black": "bg-black",
    "PC": "bg-sky-300",
    "ATQ": "bg-amber-700",
    "SS Matt": "bg-slate-400",
    "Yellow": "bg-yellow-400",
    "Light Green": "bg-green-300",
    "Rainbow": "bg-gradient-to-r from-red-400 via-green-400 to-blue-400",
    "Pink": "bg-pink-400",
    "Dark Green": "bg-green-700",
    "Clear": "bg-cyan-100 border-2 border-cyan-200",
    "Blue": "bg-blue-500",
    "Red": "bg-red-500",
    "Rosewood": "bg-red-900",
    "Steambeach": "bg-amber-900",
  };
  
  return colorMap[finish] || "bg-gray-400";
};

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProductById(productId);
  
  const [selectedFinish, setSelectedFinish] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showCopied, setShowCopied] = useState(false);

  // Update selected finish and size when product loads
  useEffect(() => {
    if (product) {
      setSelectedFinish(product.finishes?.[0] || "");
      setSelectedSize(product.sizes?.[0] || null);
    }
  }, [product?.id]);

  // Calculate price - must be called before any conditional returns
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    
    // If size-based pricing is available, use it
    if (selectedSize && product.size_prices && product.size_prices.length > 0) {
      const sizePrice = product.size_prices.find(sp => sp.size === selectedSize);
      if (sizePrice) {
        return sizePrice.price;
      }
    }
    
    // Otherwise, use the minimum price from the range
    return product.min_price || 0;
  }, [selectedSize, product]);

  const totalPrice = currentPrice * quantity;

  const handleWhatsAppClick = () => {
    if (!product) return;
    const message = `Hi! I'm interested in:\n\nProduct: ${product.name}\nFinish: ${selectedFinish}\n${selectedSize ? `Size: ${selectedSize}\n` : ''}Price: ₹${currentPrice}/pc\nQuantity: ${quantity} pcs\nTotal: ₹${totalPrice.toLocaleString('en-IN')}\n\nPlease share more details and availability.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyProductLink = () => {
    const productLink = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(productLink);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Now handle conditional rendering after all hooks are called
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="h-10 w-64 bg-muted animate-pulse mx-auto rounded mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse mx-auto rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-14">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="gap-2 mb-6"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image Section */}
          <div className="flex flex-col gap-6">
            {/* Main Image with Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="sticky top-20 bg-muted rounded-lg overflow-hidden aspect-[4/5] flex items-center justify-center relative group">
                <img 
                  src={product.product_images && product.product_images.length > 0 ? product.product_images[currentImageIndex] : "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Image Counter */}
                {product.product_images && product.product_images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1}/{product.product_images.length}
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.product_images && product.product_images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.product_images!.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === product.product_images!.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.product_images && product.product_images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.product_images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                        currentImageIndex === idx 
                          ? "border-primary ring-2 ring-primary/50" 
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <img 
                        src={image} 
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Product Details Section */}
          <div className="flex flex-col gap-6">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <div className="flex gap-2">
                    {product.is_new && (
                      <Badge className="bg-accent text-accent-foreground">New</Badge>
                    )}
                    {product.is_bestseller && (
                      <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 capitalize">
                Category: {product.category}
              </p>
            </div>

            {/* Price Section */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">₹{currentPrice}</span>
                    <span className="text-sm text-muted-foreground">/piece</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Price Range: ₹{product.min_price} - ₹{product.max_price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Packaging: {product.packaging_box} pieces per box
                  </p>
                  {selectedSize && (
                    <p className="text-sm text-muted-foreground">
                      Selected Size: <span className="font-semibold text-foreground">{selectedSize}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

              {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Size Selector with Price Variations */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size) => {
                    const sizePrice = product.size_prices?.find(sp => sp.size === size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                          selectedSize === size 
                            ? "border-primary bg-primary/10 text-primary" 
                            : "border-border bg-background hover:border-primary/50"
                        )}
                      >
                        <div>{size}</div>
                        {sizePrice && (
                          <div className="text-xs opacity-75">₹{sizePrice.price}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold mb-3">Quantity (pieces)</h3>
              <div className="flex items-center gap-4 bg-muted rounded-lg p-3 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="font-bold text-xl hover:text-primary transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center bg-transparent font-semibold outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="font-bold text-xl hover:text-primary transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total: ₹{totalPrice.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleWhatsAppClick}
                className="flex-1 gap-2 h-12 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire on WhatsApp
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2 h-12"
                onClick={handleCopyProductLink}
              >
                {showCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    Copy Product Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="specifications" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product ID</p>
                    <p className="font-semibold">{product.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available Finishes</p>
                    <p className="font-semibold">{product.finishes.length} options</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Packaging</p>
                    <p className="font-semibold">{product.packaging_box} pieces/box</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Finish Options</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.finishes.map((finish) => (
                      <div 
                        key={finish}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-full border",
                          getFinishColor(finish)
                        )} />
                        <span className="text-sm">{finish}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Available Sizes & Pricing</h4>
                    <div className="space-y-2">
                      {product.sizes.map((size) => {
                        const sizePrice = product.size_prices?.find(sp => sp.size === size);
                        return (
                          <div key={size} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <span className="text-sm font-medium">{size}</span>
                            {sizePrice && (
                              <span className="text-sm font-semibold text-primary">₹{sizePrice.price}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {product.product_images && product.product_images.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Product Gallery</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.product_images.length} high-quality images available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Package className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Standard Packaging</p>
                      <p className="text-sm text-muted-foreground">
                        Products are carefully packaged in {product.packaging_box}-piece boxes to ensure safe delivery.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Bulk Orders Welcome</p>
                      <p className="text-sm text-muted-foreground">
                        For bulk orders or custom requirements, please contact us via WhatsApp for special pricing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">Quality Assurance</p>
                      <p className="text-sm text-muted-foreground">
                        All products undergo strict quality checks before dispatch. We guarantee 100% original products.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Delivery timelines depend on location and order quantity. Please enquire for specific details regarding your location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
