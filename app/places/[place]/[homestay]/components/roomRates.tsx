"use client";

import { useState } from "react";
import RateCard from "./rateCard";
import { useStore } from "../../../../../store";
import { Rate } from "@prisma/client";

export default function RoomRates({ rates }: { rates: Rate[] }) {
  const { addSelectedRoomRates, removeSelectedRoomRates, selectedRoomRates } =
    useStore();
  const [selectedRate, setSelectedRate] = useState<Rate | null | undefined>(
    selectedRoomRates.find((rate) => rate.roomId === rates[0]?.roomId)
  );

  function onRateSelected(rate: Rate | null | undefined) {
    if (rate) {
      if (selectedRate) removeSelectedRoomRates(selectedRate);
      addSelectedRoomRates(rate);
    } else {
      removeSelectedRoomRates(selectedRate);
    }
    setSelectedRate(rate);
  }

  function isRateSelected(rate: Rate) {
    return rate.id === selectedRate?.id;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {rates.map((rate) => (
        <RateCard
          key={rate.id}
          rate={rate}
          isRateSelected={isRateSelected}
          onRateSelected={onRateSelected}
        ></RateCard>
      ))}
    </div>
  );
}
