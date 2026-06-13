import heroImage from "@/assets/hero-fittings.jpg";
import aboutImage from "@/assets/about.jpeg";

const galleryItems = [
  { title: "Kitchens", description: "Refined hardware for kitchen cabinetry.", image: heroImage },
  { title: "Wardrobes", description: "Luxury wardrobes with matching handles.", image: aboutImage },
  { title: "Luxury Doors", description: "Statement fittings for premium doors.", image: heroImage },
  { title: "Office Interiors", description: "Polished details for modern workspaces.", image: aboutImage },
  { title: "Bathrooms", description: "Sculpted fittings for serene bathrooms.", image: heroImage },
];

export function InteriorGallery() {
  return (
    <section id="gallery" className="py-20 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-3">Interior Application Gallery</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">Products in real luxury spaces.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-6">
            {galleryItems.slice(0, 2).map((item) => (
              <div key={item.title} className="group overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
                <div className="relative h-72 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{item.title}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6">
            {galleryItems.slice(2).map((item) => (
              <div key={item.title} className="group overflow-hidden rounded-3xl bg-slate-900 shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{item.title}</p>
                    <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
