import { ArrowRight, Briefcase, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function B2BSection() {
  const whatsappUrl = "https://wa.me/+919321768154?text=Hi!%20I%27m%20interested%20in%20a%20bulk%20inquiry%20for%20LEMI%20products.";

  return (
    <section className="py-20 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-3">Architect & Retail Counters</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Partner with LEMI for curated B2B sourcing.
            </h2>
            <p className="max-w-2xl text-slate-300 leading-relaxed mb-8">
              We help architects, retailers and specifiers access premium fittings, custom finishes,
              and dedicated support for bulk design projects.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Become Dealer
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white gap-2">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Bulk Inquiry
                </a>
              </Button>
              <Button asChild className="bg-white text-slate-950 hover:bg-slate-100 gap-2">
                <a href="/catalog.pdf" target="_blank" rel="noreferrer">
                  <Download className="w-4 h-4" />
                  Download Catalog
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="inline-flex items-center justify-center rounded-2xl bg-accent/10 p-3 text-accent mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Dedicated B2B Support</h3>
              <p className="text-slate-300 mt-3">Project advice, pricing, and logistics tailored for your bulk needs.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="inline-flex items-center justify-center rounded-2xl bg-accent/10 p-3 text-accent mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">Dealer Network</h3>
              <p className="text-slate-300 mt-3">Expand your retail offering with trusted premium fittings from LEMI.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
