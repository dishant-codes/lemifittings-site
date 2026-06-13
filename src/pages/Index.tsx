import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { InteriorGallery } from "@/components/InteriorGallery";
import { ProductsSection } from "@/components/ProductsSection";
import { AboutSection } from "@/components/AboutSection";
import { B2BSection } from "@/components/B2BSection";
import { SocialFeed } from "@/components/SocialFeed";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Scroll to products section
    const productsSection = document.getElementById("products");
    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <CategoriesSection onCategorySelect={handleCategorySelect} />
      <FeaturedCollections />
      <InteriorGallery />
      <ProductsSection selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <AboutSection />
      <B2BSection />
      <SocialFeed />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
