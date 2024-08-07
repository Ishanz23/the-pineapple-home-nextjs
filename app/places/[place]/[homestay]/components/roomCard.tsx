import Image from "next/image";
import { RateSelect, RoomGallerySelect } from "@/drizzle/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import RatesTabContainer from "./ratesTabContainer";

type Room = {
  id: string;
  name: string;
  description: string;
  homestayId: string;
  toiletAttached: boolean;
  airConditioned: boolean;
  kitchenAttached: boolean;
  isDorm: boolean;
  occupancy: number;
  houseRecommendation: boolean;
  categoryId: string;
  roomCount: number;
  rates: Partial<RateSelect>[];
  roomGallery: Partial<RoomGallerySelect>[];
};

export default function RoomCard({ room }: { room: Room }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:rounded-lg bg-secondary",
        `row-span-${room.rates.length}`
      )}
    >
      <div className="flex flex-col p-4 flex-grow-1">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-primary">{room.name}</h1>
          <div className="flex items-center gap-2">
            <button type="button">
              <i className="material-symbol-outlined text-primary">
                gallery_thumbnail
              </i>
            </button>
          </div>
        </div>
        <h2 className="flex items-center gap-2 py-2">
          <span className="w-20 py-1 text-xs text-center capitalize rounded-md text-primary bg-primary/10">
            {room.categoryId}
          </span>
          {room.houseRecommendation && (
            <div className="px-2 py-1 text-xs text-center text-teal-100 bg-teal-700 rounded-md">
              Recommended
            </div>
          )}
        </h2>
      </div>
      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="basis-1">
          {room.roomGallery.map((image) => (
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
      {/* Rates */}
      <div className="p-4">
        <RatesTabContainer rates={room.rates} homestayId={room.homestayId} />
      </div>
    </div>
  );
}
