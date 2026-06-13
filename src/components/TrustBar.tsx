import { Award, CheckCircle2, Globe, ShieldCheck, Star } from "lucide-react";

const trustItems = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "20+ Years Experience",
    subtitle: "Trusted in luxury interiors.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Premium Quality",
    subtitle: "Finish, fit and durability.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Modern Designs",
    subtitle: "Minimal and contemporary.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Pan India Supply",
    subtitle: "Nationwide delivery network.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Trusted by Designers",
    subtitle: "Preferred by architects.",
  },
];

export function TrustBar() {
  return (
    <section className="bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-5">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/10 p-3 text-accent mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
