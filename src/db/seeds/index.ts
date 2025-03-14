import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { movies } from "@/db/schema";
import moviesData from "./movies.json";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.local";
dotenv.config({ path: envFile });

const neonSql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: neonSql });

const values = moviesData.map((movie) => ({
  title: movie.title,
  emojis: movie.emojis,
}));

const main = async () => {
  await db.insert(movies).values(values);
};

main()
  .then(() => {
    console.log("Seeding completed successfully");
  })
  .catch((error) => {
    console.error(error);
  });
