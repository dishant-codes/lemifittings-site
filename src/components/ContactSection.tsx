import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PHONE_NUMBER = "+919321768154";
const EMAIL = "lemifittings@gmail.com";

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "+91 93217 68154",
      href: `tel:${PHONE_NUMBER}`,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: "Maharashtra, India",
      href: "#",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Hours",
      value: "Mon-Sat: 9AM - 7PM",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products? Need a bulk order quote? 
            We're here to help you find the perfect fittings for your project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="bg-gradient-hero rounded-3xl p-8 text-primary-foreground">
              <h3 className="font-display text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-primary-foreground/80 mb-8">
                Fill up the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Decorative */}
              <div className="mt-12 flex gap-4">
                <div className="w-20 h-20 bg-primary-foreground/10 rounded-full" />
                <div className="w-12 h-12 bg-accent/30 rounded-full mt-8" />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input type="email" placeholder="john@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input type="tel" placeholder="+91 98765 43210" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
