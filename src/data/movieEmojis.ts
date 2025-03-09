
export interface MovieEmoji {
  id: number;
  title: string;
  emojis: string;
  imdbID: string;
}

// List of popular movies with their emoji representations - matched to OMDB titles
export const movieEmojis: MovieEmoji[] = [
  { id: 1, title: "Star Wars: Episode IV - A New Hope", emojis: "🚀 👽 🌌 👾", imdbID: "tt0076759" },
  { id: 2, title: "The Lord of the Rings: The Fellowship of the Ring", emojis: "🧙‍♂️ 💍 🏔️ 🌋", imdbID: "tt0120737" },
  { id: 3, title: "Titanic", emojis: "🌊 🚢 💎 💔", imdbID: "tt0120338" },
  { id: 4, title: "WALL·E", emojis: "🤖 👦 ❤️", imdbID: "tt0910970" },
  { id: 5, title: "The Lion King", emojis: "🦁 👑 🌍", imdbID: "tt0110357" },
  { id: 6, title: "Inception", emojis: "🧠 💭 😴", imdbID: "tt1375666" },
  { id: 7, title: "The Matrix", emojis: "💊 🕶️ 💻 🔫", imdbID: "tt0133093" },
  { id: 8, title: "Jurassic Park", emojis: "🦖 🏝️ 🧬 🚙", imdbID: "tt0107290" },
  { id: 9, title: "The Avengers", emojis: "🦸‍♂️ 🛡️ 🔨 👊", imdbID: "tt0848228" },
  { id: 10, title: "Finding Nemo", emojis: "🐟 🌊 🦈 🐠", imdbID: "tt0266543" },
  { id: 11, title: "Frozen", emojis: "❄️ 👸 ☃️ 🏔️", imdbID: "tt2294629" },
  { id: 12, title: "The Dark Knight", emojis: "🦇 🃏 💣 🏙️", imdbID: "tt0468569" },
  { id: 13, title: "Pulp Fiction", emojis: "🔫 💼 💉 🍔", imdbID: "tt0110912" },
  { id: 14, title: "E.T. the Extra-Terrestrial", emojis: "👽 🚲 🌙 👦", imdbID: "tt0083866" },
  { id: 15, title: "Jaws", emojis: "🦈 🏖️ 🚢 🌊", imdbID: "tt0073195" },
  { id: 16, title: "The Godfather", emojis: "🤵 🐎 🔫 🍝", imdbID: "tt0068646" },
  { id: 17, title: "Back to the Future", emojis: "⏰ 🚗 ⚡ 👨‍🔬", imdbID: "tt0088763" },
  { id: 18, title: "Forrest Gump", emojis: "🏃‍♂️ 🍫 🪶 🏓", imdbID: "tt0109830" },
  { id: 19, title: "The Shawshank Redemption", emojis: "🔒 ⛏️ 🕳️ 🌧️", imdbID: "tt0111161" },
  { id: 20, title: "The Silence of the Lambs", emojis: "🔍 👨‍⚕️ 🐑 🦋", imdbID: "tt0102926" },
  { id: 21, title: "Toy Story", emojis: "🤠 🚀 🧸 🐶", imdbID: "tt0114709" },
  { id: 22, title: "The Wizard of Oz", emojis: "🌪️ 👠 🧙‍♀️ 🦁", imdbID: "tt0032138" },
  { id: 23, title: "Alien", emojis: "👽 🚀 🥚 😱", imdbID: "tt0078748" },
  { id: 24, title: "Raiders of the Lost Ark", emojis: "👨‍🏫 🏺 🐍 📜", imdbID: "tt0082971" },
  { id: 25, title: "The Princess Bride", emojis: "⚔️ 👸 💗 🏴‍☠️", imdbID: "tt0093779" },
  { id: 26, title: "Harry Potter and the Philosopher's Stone", emojis: "⚡ 🧙‍♂️ 🏰 🧹", imdbID: "tt0241527" },
  { id: 27, title: "Fight Club", emojis: "👊 🧼 🤯 🏢", imdbID: "tt0137523" },
  { id: 28, title: "The Shining", emojis: "🪓 🏨 👧 ❄️", imdbID: "tt0081505" },
  { id: 29, title: "Ghostbusters", emojis: "👻 🚫 🧪 🚗", imdbID: "tt0087332" },
  { id: 30, title: "Jumanji", emojis: "🎲 🦁 🐘 🐒", imdbID: "tt0113497" },
];
