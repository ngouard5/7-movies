
export interface MovieEmoji {
  id: number;
  title: string;
  emojis: string;
  imdbID: string;
}

// List of popular movies with their emoji representations - updated to match OMDB titles
export const movieEmojis: MovieEmoji[] = [
  { id: 1, title: "Star Wars: Episode IV - A New Hope", emojis: "🚀 👽 🌌 👾", imdbID: "tt0076759" },
  { id: 2, title: "The Lord of the Rings: The Fellowship of the Ring", emojis: "🧙‍♂️ 💍 🏔️ 🌋", imdbID: "tt0120737" },
  { id: 3, title: "Titanic", emojis: "🌊 🚢 💎 💔", imdbID: "tt0120338" },
  { id: 4, title: "WALL·E", emojis: "🤖 👦 ❤️", imdbID: "tt0910970" },
  { id: 5, title: "The Lion King", emojis: "🦁 👑 🌍", imdbID: "tt0110357" },
  { id: 6, title: "Inception", emojis: "🧠 💭 😴", imdbID: "tt1375666" },
  { id: 7, title: "The Matrix", emojis: "💊 🕶️ 💻 🔫", imdbID: "tt0133093" },
];
