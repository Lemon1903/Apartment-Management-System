import { Carousel, CarouselButton, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import TenantForm from "./TenantForm";

export default function TenantFormCarousel() {
  return (
    <Carousel className="mb-8 w-screen max-w-lg">
      <CarouselContent>
        {Array.from({ length: 5 }).map((slide, index) => (
          <CarouselItem key={index}>
            <TenantForm />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* navigation buttons */}
      <div className="absolute -bottom-10 left-1/2 w-fit -translate-x-1/2 space-x-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselButton key={index} index={index} />
        ))}
      </div>
    </Carousel>
  );
}
