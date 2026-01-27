import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OffersCarousel } from "@/components/OffersCarousel";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsSection } from "@/components/ProductsSection";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <OffersCarousel />
      </div>
      <CategoriesSection />
      <ProductsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
