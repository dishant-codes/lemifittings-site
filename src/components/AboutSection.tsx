import { CheckCircle, Award, Users, MapPin } from "lucide-react";

import aboutImg from '../assets/about-img.jpeg';

export function AboutSection() {
  const features = [
    "20+ years of industry experience",
    "Working with top builders & interior designers",
    "Budget-friendly options available",
    "Latest interior trends & designs",
    "Premium quality materials",
    "Pan-India delivery",
  ];

  return (
    <section id="about" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-6">
              <Award className="w-4 h-4" />
              <span>About Lemi Fittings</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why It Is Said
              <span className="block text-primary">"Lemi He To Sahi Hai"?</span>
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              LEMI is a nationally recognized expert in the field of hardware interior fittings, 
              established since 2003. With over 20 years of experience, we have become the best 
              hardware shop working across Maharashtra, South India, and Gujarat.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              We work with many builders, interior designers, and help countless people select 
              products matching their interior and budget. We pay attention to current interior 
              trends and architectural needs to create collections that easily gel with any surroundings.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">5000+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Regions Covered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <img
              src={aboutImg}
              alt="About Lemi Fittings"
              className="w-full rounded-3xl border border-border shadow-card object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
