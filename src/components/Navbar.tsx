import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBER = "919321768154";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Categories", href: "#categories" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const handleWhatsAppClick = () => {
    const message = "Hi! I'm interested in your fittings products. Please share more details.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img src={logo} alt="LEMI Interior Fixtures" className="h-12 md:h-14 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a href="tel:+919321768154" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 93217 68154</span>
            </a>
            
            <Button
              className="hidden md:flex gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="tel:+919321768154" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 93217 68154</span>
            </a>
            <Button
              className="mx-4 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
