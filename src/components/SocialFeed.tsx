import { Instagram } from "lucide-react";

const socialPosts = [
  {
    title: "Installation Highlight",
    caption: "Minimal matte handles in a premium kitchen.",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Premium Wardrobe",
    caption: "Designer-ready details for luxury storage.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Modern Office",
    caption: "Contemporary fittings for refined workspaces.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Bathroom Details",
    caption: "Soft finishes with premium build quality.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
];

export function SocialFeed() {
  return (
    <section id="social" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground mb-3">Instagram Feed</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Social proof from premium projects.</h2>
          </div>
          <a
            href="https://www.instagram.com/lemidisplay"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/90 hover:text-foreground"
          >
            <Instagram className="w-5 h-5" />
            @lemidisplay
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socialPosts.map((post) => (
            <article key={post.title} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1">
              <div className="relative h-72 overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/70">{post.title}</p>
                  <p className="mt-2 text-sm text-white">{post.caption}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
