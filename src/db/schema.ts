import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const movies = pgTable(
  "movies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    emojis: varchar("emojis", { length: 32 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("title_idx").on(t.title)]
);
