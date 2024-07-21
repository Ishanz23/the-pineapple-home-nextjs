"use client";

import { cn } from "@/lib/utils";
import PersonsIcon from "@/components/ui/personsIcon";
import { RateSelect } from "@/drizzle/schema";
import { useQuery } from "@tanstack/react-query";
import { foodPlanOptions } from "@/app/places/[place]/[homestay]/data/homestay-data";
import { useState } from "react";

export default function RateCard({
  rate,
  homestayId,
  onRateSelected,
  isRateSelected,
}: {
  rate: Partial<RateSelect>;
  homestayId: string;
  onRateSelected: (rate: Partial<RateSelect> | null | undefined) => void;
  isRateSelected: (rate: Partial<RateSelect>) => boolean;
}) {
  const { data: foodPlans } = useQuery(foodPlanOptions(homestayId));
  const [filterFoodPlans, setFilterFoodPlans] = useState(
    (foodPlans || []).filter((_, index) => index < 1) || []
  );
  function onMoreClick() {
    setFilterFoodPlans(() => [...(foodPlans || [])]);
  }
  return (
    <>
      {foodPlans?.length && (
        <div className="flex flex-col items-center w-full gap-2">
          {filterFoodPlans.map((foodPlan) => (
            <div
              className="flex flex-col items-center w-full h-full"
              key={foodPlan.id}
            >
              <div className="flex flex-col items-start justify-center w-full gap-2 px-4 py-3 rounded-t-md bg-primary/10">
                <div className="flex items-center justify-between w-full">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-sm bg-secondary",
                      foodPlan.name === "CP" ||
                        foodPlan.name === "MAP" ||
                        foodPlan.name === "AP"
                        ? "text-brand-first font-semibold"
                        : "text-primary"
                    )}
                  >
                    {foodPlan.title}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-semibold rounded-sm text-primary",
                      `${
                        rate.refundable ? "bg-accent/40" : "bg-destructive/30"
                      }`
                    )}
                  >
                    {rate.refundable ? "refundable" : "non-refundable"}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex text-xs text-primary">{rate.name}</div>
                  <span className="font-bold text-accent">
                    ₹
                    {(rate.tariff || 0) +
                      foodPlan.tariff * (rate.headCount || 1)}
                    /-
                  </span>
                </div>
              </div>
              {/* <div className="flex flex-col">
        <div className="flex items-center px-4 py-2 bg-muted rounded-tr-md">
          <span className="font-bold material-symbols-outlined">add</span>
        </div>
        <div className="flex items-center px-4 py-2 bg-destructive rounded-br-md">
          <span className="font-bold material-symbols-outlined">remove</span>
        </div>
      </div> */}
              {isRateSelected(rate) ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center justify-center flex-1 p-2 font-bold rounded-bl-mdn bg-accent/80 text-secondary">
                    You chose wisely!
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center p-2 rounded-br-md bg-destructive"
                    onClick={() => onRateSelected(null)}
                  >
                    <i className="font-bold material-symbol-outlined">delete</i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center justify-center w-full p-2 font-bold rounded-b-md bg-primary/20 text-accent"
                  onClick={() => onRateSelected(rate)}
                >
                  Select
                </button>
              )}
            </div>
          ))}
          {filterFoodPlans.length <= 1 ? (
            <button
              onClick={() => setFilterFoodPlans(() => [...(foodPlans || [])])}
              type="button"
              className="flex items-center justify-center px-2 py-1 text-sm border border-dashed rounded-md cursor-pointer w-fit border-brand-first text-primary"
            >
              +{foodPlans.length - 1} meal options
            </button>
          ) : (
            <button
              onClick={() =>
                setFilterFoodPlans(() =>
                  foodPlans.filter((_, index) => index < 1)
                )
              }
              type="button"
              className="flex items-center justify-center px-2 py-1 text-sm border border-dashed rounded-md cursor-pointer w-fit border-brand-second text-primary"
            >
              Hide meal options
            </button>
          )}
        </div>
      )}
    </>
  );
}
