import { ArrowRight, Award, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fittings.jpg";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Premium hardware fittings collection" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Content */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full text-primary-foreground/80 text-sm mb-6 animate-fade-up">
              <Award className="w-4 h-4" />
              <span>Established Since 2003</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Premium Hardware
              <span className="block text-accent">Interior Fittings</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 max-w-xl mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              "Lemi He To Sahi Hai" - Your trusted partner for quality knobs, handles, and fittings. 
              Serving Maharashtra, Gujarat, and South India with 20+ years of expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg gap-2"
                asChild
              >
                <a href="#products">
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-[#25D366] text-white hover:bg-[#128C7E] backdrop-blur-sm"
                onClick={() => window.open(`https://wa.me/+919321768154?text=${encodeURIComponent("Hi, I need a WhatsApp inquiry for premium fittings.")}`, '_blank')}
              >
                WhatsApp Inquiry
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-primary-foreground/20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">20+</span>
                </div>
                <p className="text-sm text-primary-foreground/70">Years Experience</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">5000+</span>
                </div>
                <p className="text-sm text-primary-foreground/70">Happy Clients</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Award className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">500+</span>
                </div>
                <p className="text-sm text-primary-foreground/70">Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
