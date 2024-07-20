"use client";

import { useState, Fragment } from "react";
import RateCard from "./rateCard";
import { useStore } from "../../../../../store";
import { RateSelect } from "@/drizzle/schema";

export default function RoomRates({
  rates,
  homestayId,
  pax,
}: {
  rates: Partial<RateSelect>[];
  homestayId: string;
  pax: number;
}) {
  const { addSelectedRoomRates, removeSelectedRoomRates, selectedRoomRates } =
    useStore();
  const [selectedRate, setSelectedRate] = useState<
    Partial<RateSelect> | null | undefined
  >(selectedRoomRates.find((rate) => rate.roomId === rates[0]?.roomId));

  function onRateSelected(rate: Partial<RateSelect> | null | undefined) {
    if (rate) {
      if (selectedRate) removeSelectedRoomRates(selectedRate);
      addSelectedRoomRates(rate);
    } else {
      removeSelectedRoomRates(selectedRate);
    }
    setSelectedRate(rate);
  }

  function isRateSelected(rate: Partial<RateSelect>) {
    return rate.id === selectedRate?.id;
  }
  return (
    <div className="flex flex-col items-center w-full gap-2">
      {rates.map((rate) => (
        <Fragment key={rate.id}>
          {rate.headCount === pax && (
            <RateCard
              key={rate.id}
              rate={rate}
              homestayId={homestayId}
              pax={pax}
              isRateSelected={isRateSelected}
              onRateSelected={onRateSelected}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
