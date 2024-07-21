import {
  text,
  sqliteTable,
  numeric,
  integer,
  index,
  uniqueIndex,
  real,
} from "drizzle-orm/sqlite-core";

import { InferSelectModel, relations, sql } from "drizzle-orm";

export const location = sqliteTable("Location", {
  id: text("id").primaryKey().notNull(),
  name: text("name").unique().notNull(),
  lat: real("lat").notNull(),
  long: real("long").notNull(),
  state: text("state").notNull(),
  altitude: integer("altitude").notNull(),
  description: text("description").notNull(),
  coverUrl: text("coverUrl").notNull(),
});

export type Location = typeof location.$inferSelect;
export type NewLocation = typeof location.$inferInsert;

// Admin Table
export const admin = sqliteTable(
  "Admin",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    mobile: text("mobile").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: integer("updatedAt", {
      mode: "timestamp",
    }).notNull(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    sex: text("sex"),
    dob: integer("dob", { mode: "timestamp" }).notNull(),
    nationality: text("nationality"),
    address: text("address"),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("Admin_email_key").on(table.email),
      mobileKey: uniqueIndex("Admin_mobile_key").on(table.mobile),
    };
  }
);

// Admin Password Table
export const adminPassword = sqliteTable(
  "AdminPassword",
  {
    hash: text("hash").notNull(),
    adminId: text("adminId")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      adminIdKey: uniqueIndex("AdminPassword_adminId_key").on(table.adminId),
    };
  }
);

// Homestay Table
export const homestay = sqliteTable(
  "Homestay",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    locationName: text("locationName")
      .notNull()
      .references(() => location.name, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      locationNameIdx: index("Homestay_locationName_idx").on(
        table.locationName
      ),
    };
  }
);

// Guest Table
export const guest = sqliteTable(
  "Guest",
  {
    id: text("id").primaryKey().notNull(),
    firstname: text("firstname").notNull(),
    lastName: text("lastName").notNull(),
    mobile: text("mobile"),
    email: text("email"),
  },
  (table) => {
    return {
      mobileKey: uniqueIndex("Guest_mobile_key").on(table.mobile),
      emailKey: uniqueIndex("Guest_email_key").on(table.email),
    };
  }
);

// User Table
export const user = sqliteTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    email: text("email").notNull(),
    mobile: text("mobile").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: integer("updatedAt", {
      mode: "timestamp",
    }).notNull(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    sex: text("sex").notNull(),
    dob: integer("dob", { mode: "timestamp" }).notNull(),
    nationality: text("nationality").notNull(),
    address: text("address"),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").on(table.email),
      mobileKey: uniqueIndex("User_mobile_key").on(table.mobile),
    };
  }
);

// Reservation Table
export const reservation = sqliteTable(
  "Reservation",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: integer("createdAt", {
      mode: "timestamp",
    }).notNull(),
    modifiedAt: integer("modifiedAt", {
      mode: "timestamp",
    }).notNull(),
    dateIn: integer("dateIn", { mode: "timestamp" }).notNull(),
    dateOut: integer("dateOut", { mode: "timestamp" }).notNull(),
    totalAmount: numeric("totalAmount").notNull(),
    dueAmount: numeric("dueAmount").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
    homestayId: text("homestayId")
      .notNull()
      .references(() => homestay.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      userIdIdx: index("Reservation_userId_idx").on(table.userId),
      homestayIdIdx: index("Reservation_homestayId_idx").on(table.homestayId),
    };
  }
);

// Homestay Amenities Table
export const homestayAmenities = sqliteTable(
  "HomestayAmenities",
  {
    homestayId: text("homestayId")
      .notNull()
      .references(() => homestay.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    amenityId: text("amenityId")
      .notNull()
      .references(() => amenity.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      homestayIdIdx: index("HomestayAmenities_homestayId_idx").on(
        table.homestayId
      ),
      amenityIdIdx: index("HomestayAmenities_amenityId_idx").on(
        table.amenityId
      ),
      homestayIdAmenityIdKey: uniqueIndex(
        "HomestayAmenities_homestayId_amenityId_key"
      ).on(table.homestayId, table.amenityId),
    };
  }
);

// Room Reserved Table
export const roomReserved = sqliteTable(
  "RoomReserved",
  {
    id: text("id").primaryKey().notNull(),
    pax: integer("pax").notNull(),
    amount: numeric("amount").notNull(),
    status: text("status").notNull(),
    guestId: text("guestId")
      .notNull()
      .references(() => guest.id, { onDelete: "cascade", onUpdate: "cascade" }),
    rateId: text("rateId")
      .notNull()
      .references(() => rate.id, { onDelete: "cascade", onUpdate: "cascade" }),
    reservationId: text("reservationId")
      .notNull()
      .references(() => reservation.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    foodPlanId: text("foodPlanId")
      .notNull()
      .references(() => foodPlan.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    guestIdIdx: index("RoomReserved_guestId_idx").on(table.guestId),
    rateIdIdx: index("RoomReserved_roomId_idx").on(table.rateId),
    foodPlanIdIdx: index("RoomReserved_foodPlanId_idx").on(table.foodPlanId),
    reservationIdIdx: index("RoomReserved_reservationId_idx").on(
      table.reservationId
    ),
  })
);

// Food Plan Table
export const foodPlan = sqliteTable(
  "FoodPlan",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    title: text("title"),
    tariff: integer("tariff").notNull(),
    nonVeg: integer("nonVeg", { mode: "boolean" }),
    homestayId: text("homestayId")
      .notNull()
      .references(() => homestay.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      nameNonVegKey: uniqueIndex("FoodPlan_name_nonVeg_key").on(
        table.name,
        table.nonVeg
      ),
      homestayIdIdx: index("HomestayAmenities_homestayId_idx").on(
        table.homestayId
      ),
    };
  }
);

// Category Table
export const category = sqliteTable("Category", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

// Room Table
export const room = sqliteTable(
  "Room",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    toiletAttached: integer("toiletAttached", { mode: "boolean" }).notNull(),
    airConditioned: integer("airConditioned", { mode: "boolean" }).notNull(),
    kitchenAttached: integer("kitchenAttached", { mode: "boolean" }).notNull(),
    isDorm: integer("isDorm", { mode: "boolean" }).notNull(),
    description: text("description").notNull(),
    occupancy: integer("occupancy").notNull(),
    roomCount: integer("roomCount").notNull().default(1),
    houseRecommendation: integer("houseRecommendation", { mode: "boolean" })
      .default(false)
      .notNull(),
    homestayId: text("homestayId")
      .notNull()
      .references(() => homestay.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    categoryId: text("categoryId")
      .notNull()
      .references(() => category.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      homestayIdIdx: index("Room_homestayId_idx").on(table.homestayId),
      categoryIdIdx: index("Room_categoryId_idx").on(table.categoryId),
    };
  }
);

// Room Features Table
export const roomFeatures = sqliteTable(
  "RoomFeatures",
  {
    roomId: text("roomId")
      .notNull()
      .references(() => room.id, { onDelete: "cascade", onUpdate: "cascade" }),
    featureId: text("featureId")
      .notNull()
      .references(() => feature.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      roomIdIdx: index("RoomFeatures_roomId_idx").on(table.roomId),
      featureIdIdx: index("RoomFeatures_featureId_idx").on(table.featureId),
      roomIdFeatureIdKey: uniqueIndex("RoomFeatures_roomId_featureId_key").on(
        table.roomId,
        table.featureId
      ),
    };
  }
);

// Homestay Gallery
export const homestayGallery = sqliteTable(
  "HomestayGallery",
  {
    url: text("url").primaryKey().notNull(),
    category: text("category").notNull(),
    description: text("description"),
    isPrimary: integer("isPrimary", { mode: "boolean" })
      .notNull()
      .default(false),
    homestayId: text("homestayId")
      .notNull()
      .references(() => homestay.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      homestayIdIdx: index("HomestayGallery_homestayId_idx").on(
        table.homestayId
      ),
    };
  }
);

// Amenity Table
export const amenity = sqliteTable(
  "Amenity",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("Amenity_name_key").on(table.name),
    };
  }
);

// Feature Table
export const feature = sqliteTable(
  "Feature",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("Feature_name_key").on(table.name),
    };
  }
);

// Room Gallery Table
export const roomGallery = sqliteTable(
  "RoomGallery",
  {
    url: text("url").primaryKey().notNull(),
    category: text("category").notNull(),
    description: text("description"),
    isPrimary: integer("isPrimary", { mode: "boolean" })
      .notNull()
      .default(false),
    roomId: text("roomId")
      .notNull()
      .references(() => room.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      roomIdIdx: index("RoomGallery_roomId_idx").on(table.roomId),
    };
  }
);

export type RoomGallerySelect = InferSelectModel<typeof roomGallery>;

// Password Table
export const password = sqliteTable(
  "Password",
  {
    hash: text("hash").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      userIdKey: uniqueIndex("Password_userId_key").on(table.userId),
    };
  }
);

// Rate Table
export const rate = sqliteTable(
  "Rate",
  {
    id: text("id").primaryKey().notNull(),
    type: text("type").notNull().default("B2B"),
    headCount: integer("headCount").notNull(),
    tariff: integer("tariff").notNull(),
    name: text("name"),
    description: text("description"),
    refundable: integer("refundable", { mode: "boolean" })
      .notNull()
      .default(true),
    roomId: text("roomId")
      .notNull()
      .references(() => room.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    roomIdIdx: index("Rate_roomId_idx").on(table.roomId),
  })
);

export type RateSelect = InferSelectModel<typeof rate>;

export const availability = sqliteTable(
  "Availability",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    stayDate: integer("stayDate", { mode: "timestamp" }).notNull(),
    avlCount: integer("avlCount").notNull().default(1),
    roomId: text("roomId")
      .notNull()
      .references(() => room.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => ({
    stayDateRoomKey: uniqueIndex("Availability_stayDate_roomId_key").on(
      table.stayDate,
      table.roomId
    ),
    roomIdIdx: index("Availability_roomId_idx").on(table.roomId),
  })
);
// Invoice Table
export const invoice = sqliteTable("Invoice", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  guestName: text("guestName").notNull(),
  invoiceDate: integer("invoiceDate", { mode: "timestamp" }).notNull(),
  checkinDate: integer("checkinDate", { mode: "timestamp" }).notNull(),
  checkoutDate: integer("checkoutDate", { mode: "timestamp" }).notNull(),
  isDeleted: integer("isDeleted", { mode: "boolean" }).notNull().default(false),
  advanceAmount: integer("advanceAmount").default(0),
  homestayId: text("homestayId")
    .notNull()
    .references(() => homestay.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

// Invoice Accomodation Table
export const invoiceAccomodation = sqliteTable(
  "InvoiceAccomodation",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    rate: integer("rate").notNull(),
    invoiceId: integer("invoiceId")
      .notNull()
      .references(() => invoice.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      invoiceIdIdx: index("InvoiceAccomodation_invoiceId_idx").on(
        table.invoiceId
      ),
    };
  }
);

// Food Types Enum
export type FoodType = "breakfast" | "lunch" | "dinner" | "snacks";

// Invoice Food Table
export const invoiceFood = sqliteTable(
  "InvoiceFood",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").$type<FoodType>().notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    rate: integer("rate").notNull(),
    deleted: integer("deleted", { mode: "boolean" }).default(false),
    invoiceId: integer("invoiceId")
      .notNull()
      .references(() => invoice.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      invoiceIdIdx: index("InvoiceFood_invoiceId_idx").on(table.invoiceId),
    };
  }
);

// Invoice Amenities Table
export const invoiceAmenities = sqliteTable(
  "InvoiceAmenities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    rate: integer("rate").notNull(),
    deleted: integer("deleted", { mode: "boolean" }).default(false),
    invoiceId: integer("invoiceId")
      .notNull()
      .references(() => invoice.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      invoiceIdIdx: index("InvoiceAmenities_invoiceId_idx").on(table.invoiceId),
    };
  }
);

export const categoryRelations = relations(category, ({ one, many }) => ({
  rooms: many(room),
}));

export const roomRelations = relations(room, ({ one, many }) => ({
  homestay: one(homestay, {
    fields: [room.homestayId],
    references: [homestay.id],
  }),
  category: one(category, {
    fields: [room.categoryId],
    references: [category.id],
  }),
  rates: many(rate),
  roomGallery: many(roomGallery),
}));

export const rateRelations = relations(rate, ({ one, many }) => ({
  room: one(room, {
    fields: [rate.roomId],
    references: [room.id],
  }),
}));

export const roomGalleryRelations = relations(roomGallery, ({ one }) => ({
  room: one(room, {
    fields: [roomGallery.roomId],
    references: [room.id],
  }),
}));

export const homestayRelations = relations(homestay, ({ one, many }) => ({
  homestayGallery: many(homestayGallery),
  homestayAmenities: many(homestayAmenities),
  location: one(location, {
    fields: [homestay.locationName],
    references: [location.name],
  }),
  rooms: many(room),
}));

export const homestayGalleryRelations = relations(
  homestayGallery,
  ({ one }) => ({
    homestay: one(homestay, {
      fields: [homestayGallery.homestayId],
      references: [homestay.id],
    }),
  })
);

export const homestayAmenitiesRelations = relations(
  homestayAmenities,
  ({ many }) => ({
    homestay: many(homestay),
  })
);

export const adminPasswordRelations = relations(adminPassword, ({ one }) => ({
  password: one(admin, {
    fields: [adminPassword.adminId],
    references: [admin.id],
  }),
}));

export const adminRelations = relations(admin, ({ many }) => ({
  password: many(adminPassword),
}));

export const invoiceRelations = relations(invoice, ({ many }) => ({
  accomodation: many(invoiceAccomodation),
  food: many(invoiceFood),
  amenities: many(invoiceAmenities),
}));

export const accomodationRelations = relations(
  invoiceAccomodation,
  ({ one }) => ({
    invoice: one(invoice, {
      fields: [invoiceAccomodation.invoiceId],
      references: [invoice.id],
    }),
  })
);

export const foodRelations = relations(invoiceFood, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceFood.invoiceId],
    references: [invoice.id],
  }),
}));

export const amenitiesRelations = relations(invoiceAmenities, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceAmenities.invoiceId],
    references: [invoice.id],
  }),
}));
