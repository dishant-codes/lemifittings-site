import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OffersCarousel } from "@/components/OffersCarousel";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsSection } from "@/components/ProductsSection";
import { AboutSection } from "@/components/AboutSection";
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
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <OffersCarousel />
      </div>
      <CategoriesSection onCategorySelect={handleCategorySelect} />
      <ProductsSection selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
