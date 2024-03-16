import { Invoice } from "@/app/business/[homestay]/invoice/shared/shared-code";
import { db } from "@/drizzle";
import {
  invoice,
  invoiceAccomodation,
  invoiceAmenities,
  invoiceFood,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllInvoices() {
  return await db.query.invoice.findMany({});
}

export async function getInvoiceById(invoiceId: number) {
  try {
    const invoiceData = await db.query.invoice.findFirst({
      where: eq(invoice.id, invoiceId as number),
    });
    if (invoiceData) {
      const [accomodation, food, amenities] = await Promise.all([
        db.query.invoiceAccomodation.findMany({
          where: eq(invoiceAccomodation.invoiceId, invoiceData.id),
          columns: {
            id: true,
            name: true,
            quantity: true,
            rate: true,
          },
        }),
        db.query.invoiceFood.findMany({
          where: eq(invoiceFood.invoiceId, invoiceData.id),
          columns: {
            id: true,
            type: true,
            name: true,
            quantity: true,
            rate: true,
          },
        }),
        db.query.invoiceAmenities.findMany({
          where: eq(invoiceAmenities.invoiceId, invoiceData.id),
          columns: {
            id: true,
            name: true,
            quantity: true,
            rate: true,
          },
        }),
      ]);
      return {
        ...invoiceData,
        accomodation,
        food,
        amenities,
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createInvoice(invoiceData: Invoice) {
  const newInvoice = await db
    .insert(invoice)
    .values({
      guestName: invoiceData.guestName,
      invoiceDate: invoiceData.invoiceDate,
      checkinDate: invoiceData.checkinDate,
      checkoutDate: invoiceData.checkoutDate,
    })
    .returning();

  for (const item of invoiceData.accomodation) {
    await db
      .insert(invoiceAccomodation)
      .values({
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  for (const item of invoiceData.food.breakfast) {
    await db
      .insert(invoiceFood)
      .values({
        type: "breakfast",
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  for (const item of invoiceData.food.lunch) {
    await db
      .insert(invoiceFood)
      .values({
        type: "lunch",
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  for (const item of invoiceData.food.snacks) {
    await db
      .insert(invoiceFood)
      .values({
        type: "snacks",
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  for (const item of invoiceData.food.dinner) {
    await db
      .insert(invoiceFood)
      .values({
        type: "dinner",
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  for (const item of invoiceData.amenities) {
    await db
      .insert(invoiceAmenities)
      .values({
        name: item.name,
        quantity: +item.quantity,
        rate: +item.rate,
        invoiceId: +newInvoice[0].id,
      })
      .returning();
  }

  return newInvoice;
}