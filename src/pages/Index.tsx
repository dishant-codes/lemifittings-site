import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import InstagramFeed from "@/components/InstagramFeed";

const Index = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setSelectedCategory(categoryId || "all");
  }, [categoryId]);

  const handleCategorySelect = (nextCategoryId: string) => {
    setSelectedCategory(nextCategoryId);
    navigate(`/category/${nextCategoryId}`);

    const productsSection = document.getElementById("products");
    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setSelectedCategory(nextCategoryId);
    navigate(nextCategoryId === "all" ? "/" : `/category/${nextCategoryId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustBar />
      <CategoriesSection onCategorySelect={handleCategorySelect} />
      {/* <FeaturedCollections /> */}
      {/* <InteriorGallery /> */}
      <ProductsSection selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <AboutSection />
      <B2BSection />
      {/* <SocialFeed /> */}
      <InstagramFeed />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
