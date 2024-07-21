"use client";
import { RateSelect } from "@/drizzle/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonsIcon from "@/components/ui/personsIcon";
import RoomRates from "./roomRates";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function RatesTabContainer({
  rates,
  homestayId,
}: {
  rates: Partial<RateSelect>[];
  homestayId: string;
}) {
  const tabs = Array.from(new Set(rates.map((rate) => rate.headCount || 0)));
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  return (
    <div className="flex flex-col items-center h-full gap-4">
      {tabs.length > 1 ? (
        <Tabs
          defaultValue={`${selectedTab}`}
          className="w-full"
          onValueChange={(val) => setSelectedTab(+val)}
        >
          <TabsList className="w-full">
            {tabs.map((tab) => (
              <TabsTrigger value={`${tab}`} className="flex-1" key={tab}>
                <>
                  <PersonsIcon headCount={tab > 3 ? 3 : tab} />
                  {/* Badge for count over 2 persons */}
                  {tab - 3 > 0 && (
                    <div
                      className={cn(
                        "mx-1 px-2 py-1 text-xs font-semibold rounded-full bg-secondary",
                        selectedTab === tab ? "" : "bg-background"
                      )}
                    >
                      {`+${tab - 3}`}
                    </div>
                  )}
                </>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent value={`${tab}`} key={tab}>
              <RoomRates rates={rates} homestayId={homestayId} pax={tab} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <RoomRates rates={rates} homestayId={homestayId} pax={tabs[0]} />
      )}
    </div>
  );
}
