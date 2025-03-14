import { db } from "@/db";
import { movies } from "@/db/schema";

export default async function Page() {
  const result = await db.select().from(movies);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-bold">{result.length} movies</div>
      <ul className="mt-4">
        {result.map((movie) => (
          <li key={movie.id}>
            {movie.emojis} {movie.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
