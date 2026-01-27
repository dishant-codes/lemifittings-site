import { ArrowRight } from "lucide-react";
import { categories } from "@/data/products";

export function CategoriesSection() {
  const categoryIcons: Record<string, React.ReactNode> = {
    knobs: (
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-primary rounded-lg" />
      </div>
    ),
    handles: (
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
        <div className="w-10 h-4 bg-accent rounded-full" />
      </div>
    ),
    keyholes: (
      <div className="w-16 h-16 bg-steel/10 rounded-full flex items-center justify-center">
        <div className="w-6 h-10 bg-steel rounded-lg" />
      </div>
    ),
    accessories: (
      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-gold/50 rounded-md rotate-45" />
      </div>
    ),
  };

  return (
    <section id="categories" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our carefully organized categories to find the perfect fittings for your space.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`#products`}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.id]}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>

              {/* Arrow */}
              <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Browse</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
