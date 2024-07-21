import { db } from "@/drizzle";
import { queryOptions } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

import { foodPlan, homestay } from "@/drizzle/schema";

export const homestayOptions = (id: string) =>
  queryOptions({
    queryKey: ["homestay", id],
    queryFn: async () => getHomestayById(id),
  });
export const foodPlanOptions = (homestayId: string) =>
  queryOptions({
    queryKey: ["foodPlan", homestayId],
    queryFn: async () => getFoodPlans(homestayId),
  });

function getHomestayById(id: string) {
  if (typeof id !== "string" || id.trim() === "") {
    throw new Error("Invalid id parameter");
  }
  const homestayData = db.query.homestay.findFirst({
    where: eq(homestay.id, id),
    columns: {
      name: true,
    },
    with: {
      location: {
        columns: {
          name: true,
          state: true,
          lat: true,
          long: true,
        },
      },
      rooms: {
        with: {
          rates: {
            columns: {
              id: true,
              type: true,
              tariff: true,
              headCount: true,
              refundable: true,
              name: true,
              description: true,
            },
          },
          roomGallery: {
            columns: {
              url: true,
              category: true,
              description: true,
              isPrimary: true,
            },
          },
        },
      },
      homestayGallery: {
        columns: {
          url: true,
          category: true,
        },
      },
    },
  });
  if (!homestayData) {
    throw new Error(`Homestay with id ${id} not found`);
  }

  return homestayData;
}

function getFoodPlans(homestayId: string) {
  return db
    .select({
      id: foodPlan.id,
      name: foodPlan.name,
      title: foodPlan.title,
      tariff: foodPlan.tariff,
      nonVeg: foodPlan.nonVeg,
    })
    .from(foodPlan)
    .where(eq(foodPlan.homestayId, homestayId))
    .orderBy(foodPlan.tariff);
}
