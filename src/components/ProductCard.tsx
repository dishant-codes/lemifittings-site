import { useState } from "react";
import { MessageCircle, Heart, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const WHATSAPP_NUMBER = "919321768154";

export function ProductCard({ product }: ProductCardProps) {
  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in ${product.name} (${selectedFinish}${selectedSize ? `, Size: ${selectedSize}` : ''}) - ₹${product.price}/pc. Please share more details.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card
      className="group relative overflow-hidden border-border/50 bg-card hover:shadow-card transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.is_new && (
          <Badge className="bg-accent text-accent-foreground">New</Badge>
        )}
        {product.is_bestseller && (
          <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
        )}
      </div>

      {/* Quick actions */}
      <div
        className={cn(
          "absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}
      >
        <Button
          size="icon"
          variant="secondary"
          className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* WhatsApp button on hover */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          <Button
            className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="w-4 h-4" />
            Enquire on WhatsApp
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="text-right">
            <span className="font-bold text-lg text-foreground">₹{product.price}</span>
            <span className="text-xs text-muted-foreground block">/pc</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Finish selector */}
        {product.finishes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Finish: {selectedFinish}</p>
            <div className="flex flex-wrap gap-1">
              {product.finishes.slice(0, 5).map((finish) => (
                <button
                  key={finish}
                  onClick={() => setSelectedFinish(finish)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border transition-all",
                    selectedFinish === finish
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {finish}
                </button>
              ))}
              {product.finishes.length > 5 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{product.finishes.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Size selector if applicable */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-muted-foreground">Size: {selectedSize}</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md border transition-all",
                    selectedSize === size
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Packaging info */}
        <p className="mt-4 text-xs text-muted-foreground">
          📦 Packaging: {product.packaging_box} pcs/box
        </p>

        {/* Always visible WhatsApp button */}
        <Button
          className="w-full mt-4 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="w-4 h-4" />
          Enquire on WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
