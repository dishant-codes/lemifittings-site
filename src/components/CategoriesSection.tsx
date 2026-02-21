import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface CategoriesSectionProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded-lg w-1/3 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Browse our carefully organized categories to find the perfect fittings for your space.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.name)}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-up text-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Category Image or Fallback */}
              {category.image ? (
                <div className="w-full h-48 bg-muted overflow-hidden flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Title */}
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm md:text-base text-gray-100 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Browse</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
