"use client";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { RoomGallerySelect } from "@/drizzle/schema";

export default function RoomCarousel({
  images,
}: {
  images: Partial<RoomGallerySelect>[];
}) {
  return (
    <Carousel
      opts={{
        align: "center",
        containScroll: false,
        loop: true,
        duration: 30,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Fade() as any,
      ]}
      className="w-full"
    >
      <CarouselContent className="basis-1">
        {images.map((image) => (
          <CarouselItem key={image.url} className="">
            <div className="px-4">
              <Card>
                <CardContent className="flex items-center justify-center p-0 aspect-video">
                  <Image
                    src={image.url || ""}
                    alt={image.description || "Room Gallery Image"}
                    width={800}
                    height={200}
                    priority
                    className="w-full h-full rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} />
      <CarouselNext variant={"ghost"} />
    </Carousel>
  );
}
