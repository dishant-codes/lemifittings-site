import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "Categories", href: "#categories" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const categories = [
    { label: "Knobs", href: "#products" },
    { label: "Handles", href: "#products" },
    { label: "Key Holes", href: "#products" },
    { label: "Accessories", href: "#products" },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/lemifittings", label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/lemidisplay", label: "Instagram" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/lemifittings", label: "Twitter" },
    { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@lemifittings", label: "YouTube" },
  ];

  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-xl text-accent">L</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">LEMI</h3>
                <p className="text-[10px] text-primary-foreground/60 -mt-1 tracking-wider">
                  FITTINGS
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Your trusted partner for premium hardware interior fittings since 2003.
              "Lemi He To Sahi Hai"
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-3">
              {categories.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Stay Updated</h4>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Subscribe to get updates on new products and offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:border-accent"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Lemi Fittings. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={scrollToTop}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
