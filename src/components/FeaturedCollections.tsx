import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const collections = [
  {
    title: "Matte Black Collection",
    subtitle: "Bold finishes for premium kitchens.",
  },
  {
    title: "Rosewood Series",
    subtitle: "Warm timber tones with subtle shine.",
  },
  {
    title: "Signature Series",
    subtitle: "Curated for designer-grade interiors.",
  },
  {
    title: "Steam Beech Collection",
    subtitle: "Soft texture for luxury wardrobes.",
  },
];

export function FeaturedCollections() {
  return (
    <section id="collections" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Featured Collections
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Luxury collections for premium spaces.
            </h2>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
            <a href="#products">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {collections.map((collection, index) => (
            <article
              key={collection.title}
              className="group relative overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 text-white p-8 transition-shadow hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-90" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                    Collection
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight">{collection.title}</h3>
                  <p className="mt-4 text-sm text-slate-300">{collection.subtitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Luxury line
                  </p>
                  <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
