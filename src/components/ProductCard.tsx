import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Package, Badge as BadgeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const WHATSAPP_NUMBER = "+919321768154";

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi! I'm interested in ${product.name}. Please share more details and pricing.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const mainImage = product.product_images && product.product_images.length > 0 
    ? product.product_images[0] 
    : "/placeholder.svg";

  return (
    <Link to={`/product/${product.slug || product.id}`} className="block h-full">
      <Card
        className="group relative overflow-hidden border border-border/50 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.is_new && (
            <Badge className="bg-accent text-accent-foreground text-xs">New</Badge>
          )}
          {product.is_bestseller && (
            <Badge className="bg-primary text-primary-foreground text-xs">Bestseller</Badge>
          )}
        </div>

        {/* Image section */}
        <div className="relative w-full bg-muted overflow-hidden flex-shrink-0">
          <div className="relative aspect-[4/5] bg-gradient-to-br from-muted to-muted-foreground/5">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            
            <img 
              src={mainImage} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Image count badge */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                +{product.product_images.length - 1}
              </div>
            )}
            
            {/* WhatsApp button on hover */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300",
                isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              )}
            >
              <Button
                className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium"
                onClick={handleWhatsAppClick}
                size="sm"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.short_description && (
            <p className="text-xs md:text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">₹{product.min_price} - ₹{product.max_price}</span>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.packaging_box}
            </span>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.finishes && product.finishes.length > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {product.finishes.length} finish{product.finishes.length > 1 ? 'es' : ''}
              </span>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded">
                {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* WhatsApp button (always visible) */}
          <Button
            className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium mt-auto"
            onClick={handleWhatsAppClick}
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
