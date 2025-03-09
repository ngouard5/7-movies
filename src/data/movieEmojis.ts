
export interface MovieEmoji {
  id: number;
  title: string;
  emojis: string;
  imdbID: string;
}

// List of popular movies with their emoji representations
export const movieEmojis: MovieEmoji[] = [
  { id: 1, title: "Star Wars", emojis: "🚀 👽 🌌 👾", imdbID: "tt0076759" },
  { id: 2, title: "The Lord of the Rings", emojis: "🧙‍♂️ 💍 🏔️ 🌋", imdbID: "tt0120737" },
  { id: 3, title: "Titanic", emojis: "🌊 🚢 💎 💔", imdbID: "tt0120338" },
  { id: 4, title: "WALL·E", emojis: "🤖 👦 ❤️", imdbID: "tt0910970" },
  { id: 5, title: "The Lion King", emojis: "🦁 👑 🌍", imdbID: "tt0110357" },
  { id: 6, title: "Cast Away", emojis: "🏝️ 🏐 🤔", imdbID: "tt0162222" },
  { id: 7, title: "Inception", emojis: "🧠 💭 😴", imdbID: "tt1375666" },
  { id: 8, title: "Jurassic Park", emojis: "🦖 🦕 🏝️ 🧬", imdbID: "tt0107290" },
  { id: 9, title: "The Matrix", emojis: "💊 🕶️ 💻 🔫", imdbID: "tt0133093" },
  { id: 10, title: "Harry Potter", emojis: "⚡ 🧙‍♂️ 🪄 🦉", imdbID: "tt0241527" },
  { id: 11, title: "Finding Nemo", emojis: "🐠 🌊 🦈 🐢", imdbID: "tt0266543" },
  { id: 12, title: "The Avengers", emojis: "🦸‍♂️ 🛡️ 🔨 👊", imdbID: "tt0848228" },
];
