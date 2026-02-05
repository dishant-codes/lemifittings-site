import { useOffers } from "@/hooks/useOffers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const WHATSAPP_NUMBER = "+919321768154";

export function OffersCarousel() {
  const { data: offers, isLoading } = useOffers();
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const handleWhatsAppClick = (offerTitle: string) => {
    const message = `Hi! I'm interested in your offer: ${offerTitle}. Please share more details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="w-full h-32 bg-muted animate-pulse rounded-lg" />
    );
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {offers.map((offer) => (
            <CarouselItem key={offer.id}>
              <div
                className="relative overflow-hidden rounded-xl p-6 md:p-8"
                style={{
                  backgroundColor: offer.background_color || '#1a1a2e',
                  color: offer.text_color || '#ffffff',
                }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-display font-bold mb-1">
                      {offer.title}
                    </h3>
                    {offer.subtitle && (
                      <p className="text-lg md:text-xl opacity-90 mb-2">
                        {offer.subtitle}
                      </p>
                    )}
                    {offer.description && (
                      <p className="text-sm opacity-75">
                        {offer.description}
                      </p>
                    )}
                  </div>
                  <Button
                    className="shrink-0 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                    onClick={() => handleWhatsAppClick(offer.title)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enquire Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {offers.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </section>
  );
}
