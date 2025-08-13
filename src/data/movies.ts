export interface Movie {
  id: number;
  title: string;
  emojis: string;
  imdbID: string;
  frenchTitle?: string;
  genre?: string;
  year?: number;
  director?: string;
  mainActor?: string;
}

// Unified movie data with all information in one place
export const movies: Movie[] = [
  {
    id: 1,
    title: "Star Wars",
    emojis: "🚀 👽 🌌 👾",
    imdbID: "tt0076759",
    frenchTitle: "Star Wars : Épisode IV - Un nouvel espoir",
    genre: "Science-Fiction",
    year: 1977,
    director: "George Lucas",
    mainActor: "Mark Hamill"
  },
  {
    id: 2,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    emojis: "🧙‍♂️ 💍 🏔️ 🌋",
    imdbID: "tt0120737",
    frenchTitle: "Le Seigneur des anneaux : La Communauté de l'anneau",
    genre: "Fantasy",
    year: 2001,
    director: "Peter Jackson",
    mainActor: "Elijah Wood"
  },
  {
    id: 3,
    title: "Titanic",
    emojis: "🌊 🚢 💎 💔",
    imdbID: "tt0120338",
    frenchTitle: "Titanic",
    genre: "Romance",
    year: 1997,
    director: "James Cameron",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 4,
    title: "WALL·E",
    emojis: "🤖 👦 ❤️",
    imdbID: "tt0910970",
    frenchTitle: "WALL·E",
    genre: "Animation",
    year: 2008,
    director: "Andrew Stanton",
    mainActor: "Ben Burtt"
  },
  {
    id: 5,
    title: "The Lion King",
    emojis: "🦁 👑 🌍",
    imdbID: "tt0110357",
    frenchTitle: "Le Roi Lion",
    genre: "Animation",
    year: 1994,
    director: "Roger Allers",
    mainActor: "Matthew Broderick"
  },
  {
    id: 6,
    title: "Inception",
    emojis: "🧠 💭 😴",
    imdbID: "tt1375666",
    frenchTitle: "Inception",
    genre: "Science-Fiction",
    year: 2010,
    director: "Christopher Nolan",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 7,
    title: "The Matrix",
    emojis: "💊 🕶️ 💻 🔫",
    imdbID: "tt0133093",
    frenchTitle: "Matrix",
    genre: "Science-Fiction",
    year: 1999,
    director: "Lana Wachowski",
    mainActor: "Keanu Reeves"
  },
  {
    id: 8,
    title: "Jurassic Park",
    emojis: "🦖 🏝️ 🧬 🚙",
    imdbID: "tt0107290",
    frenchTitle: "Jurassic Park",
    genre: "Adventure",
    year: 1993,
    director: "Steven Spielberg",
    mainActor: "Sam Neill"
  },
  {
    id: 9,
    title: "The Avengers",
    emojis: "🦸‍♂️ 🛡️ 🔨 👊",
    imdbID: "tt0848228",
    frenchTitle: "Avengers",
    genre: "Action",
    year: 2012,
    director: "Joss Whedon",
    mainActor: "Robert Downey Jr."
  },
  {
    id: 10,
    title: "Finding Nemo",
    emojis: "🐟 🌊 🦈 🐠",
    imdbID: "tt0266543",
    frenchTitle: "Le Monde de Nemo",
    genre: "Animation",
    year: 2003,
    director: "Andrew Stanton",
    mainActor: "Albert Brooks"
  },
  {
    id: 11,
    title: "Frozen",
    emojis: "❄️ 👸 ☃️ 🏔️",
    imdbID: "tt2294629",
    frenchTitle: "La Reine des neiges",
    genre: "Animation",
    year: 2013,
    director: "Chris Buck",
    mainActor: "Kristen Bell"
  },
  {
    id: 12,
    title: "The Dark Knight",
    emojis: "🦇 🃏 💣 🏙️",
    imdbID: "tt0468569",
    frenchTitle: "The Dark Knight : Le Chevalier noir",
    genre: "Action",
    year: 2008,
    director: "Christopher Nolan",
    mainActor: "Christian Bale"
  },
  {
    id: 13,
    title: "Pulp Fiction",
    emojis: "🔫 💼 💉 🍔",
    imdbID: "tt0110912",
    frenchTitle: "Pulp Fiction",
    genre: "Crime",
    year: 1994,
    director: "Quentin Tarantino",
    mainActor: "John Travolta"
  },
  {
    id: 14,
    title: "E.T. the Extra-Terrestrial",
    emojis: "👽 🚲 🌙 👦",
    imdbID: "tt0083866",
    frenchTitle: "E.T. l'extra-terrestre",
    genre: "Science-Fiction",
    year: 1982,
    director: "Steven Spielberg",
    mainActor: "Henry Thomas"
  },
  {
    id: 15,
    title: "Jaws",
    emojis: "🦈 🏖️ 🚢 🌊",
    imdbID: "tt0073195",
    frenchTitle: "Les Dents de la mer",
    genre: "Thriller",
    year: 1975,
    director: "Steven Spielberg",
    mainActor: "Roy Scheider"
  },
  {
    id: 16,
    title: "The Godfather",
    emojis: "🤵 🐎 🔫 🍝",
    imdbID: "tt0068646",
    frenchTitle: "Le Parrain",
    genre: "Crime",
    year: 1972,
    director: "Francis Ford Coppola",
    mainActor: "Marlon Brando"
  },
  {
    id: 17,
    title: "Back to the Future",
    emojis: "⏰ 🚗 ⚡ 👨‍🔬",
    imdbID: "tt0088763",
    frenchTitle: "Retour vers le futur",
    genre: "Science-Fiction",
    year: 1985,
    director: "Robert Zemeckis",
    mainActor: "Michael J. Fox"
  },
  {
    id: 18,
    title: "Forrest Gump",
    emojis: "🏃‍♂️ 🍫 🪶 🏓",
    imdbID: "tt0109830",
    frenchTitle: "Forrest Gump",
    genre: "Drama",
    year: 1994,
    director: "Robert Zemeckis",
    mainActor: "Tom Hanks"
  },
  {
    id: 19,
    title: "The Shawshank Redemption",
    emojis: "🔒 ⛏️ 🕳️ 🌧️",
    imdbID: "tt0111161",
    frenchTitle: "Les Évadés",
    genre: "Drama",
    year: 1994,
    director: "Frank Darabont",
    mainActor: "Tim Robbins"
  },
  {
    id: 20,
    title: "The Silence of the Lambs",
    emojis: "🔍 👨‍⚕️ 🐑 🦋",
    imdbID: "tt0102926",
    frenchTitle: "Le Silence des agneaux",
    genre: "Thriller",
    year: 1991,
    director: "Jonathan Demme",
    mainActor: "Jodie Foster"
  },
  {
    id: 21,
    title: "Toy Story",
    emojis: "🤠 🚀 🧸 🐶",
    imdbID: "tt0114709",
    frenchTitle: "Toy Story",
    genre: "Animation",
    year: 1995,
    director: "John Lasseter",
    mainActor: "Tom Hanks"
  },
  {
    id: 22,
    title: "The Wizard of Oz",
    emojis: "🌪️ 👠 🧙‍♀️ 🦁",
    imdbID: "tt0032138",
    frenchTitle: "Le Magicien d'Oz",
    genre: "Fantasy",
    year: 1939,
    director: "Victor Fleming",
    mainActor: "Judy Garland"
  },
  {
    id: 23,
    title: "Alien",
    emojis: "👽 🚀 🥚 😱",
    imdbID: "tt0078748",
    frenchTitle: "Alien, le huitième passager",
    genre: "Horror",
    year: 1979,
    director: "Ridley Scott",
    mainActor: "Sigourney Weaver"
  },
  {
    id: 24,
    title: "Raiders of the Lost Ark",
    emojis: "👨‍🏫 🏺 🐍 📜",
    imdbID: "tt0082971",
    frenchTitle: "Les Aventuriers de l'arche perdue",
    genre: "Adventure",
    year: 1981,
    director: "Steven Spielberg",
    mainActor: "Harrison Ford"
  },
  {
    id: 25,
    title: "The Princess Bride",
    emojis: "⚔️ 👸 💗 🏴‍☠️",
    imdbID: "tt0093779",
    frenchTitle: "Princess Bride",
    genre: "Adventure",
    year: 1987,
    director: "Rob Reiner",
    mainActor: "Cary Elwes"
  },
  {
    id: 26,
    title: "Harry Potter and the Philosopher's Stone",
    emojis: "⚡ 🧙‍♂️ 🏰 🧹",
    imdbID: "tt0241527",
    frenchTitle: "Harry Potter à l'école des sorciers",
    genre: "Fantasy",
    year: 2001,
    director: "Chris Columbus",
    mainActor: "Daniel Radcliffe"
  },
  {
    id: 27,
    title: "Fight Club",
    emojis: "👊 🧼 🤯 🏢",
    imdbID: "tt0137523",
    frenchTitle: "Fight Club",
    genre: "Drama",
    year: 1999,
    director: "David Fincher",
    mainActor: "Brad Pitt"
  },
  {
    id: 28,
    title: "The Shining",
    emojis: "🪓 🏨 👧 ❄️",
    imdbID: "tt0081505",
    frenchTitle: "Shining",
    genre: "Horror",
    year: 1980,
    director: "Stanley Kubrick",
    mainActor: "Jack Nicholson"
  },
  {
    id: 29,
    title: "Ghostbusters",
    emojis: "👻 🚫 🧪 🚗",
    imdbID: "tt0087332",
    frenchTitle: "SOS Fantômes",
    genre: "Comedy",
    year: 1984,
    director: "Ivan Reitman",
    mainActor: "Bill Murray"
  },
  {
    id: 30,
    title: "Jumanji",
    emojis: "🎲 🦁 🐘 🐒",
    imdbID: "tt0113497",
    frenchTitle: "Jumanji",
    genre: "Adventure",
    year: 1995,
    director: "Joe Johnston",
    mainActor: "Robin Williams"
  },
  {
    id: 31,
    title: "The Terminator",
    emojis: "🤖 🔫 🕒 💥",
    imdbID: "tt0088247",
    frenchTitle: "Terminator",
    genre: "Science-Fiction",
    year: 1984,
    director: "James Cameron",
    mainActor: "Arnold Schwarzenegger"
  },
  {
    id: 32,
    title: "Casablanca",
    emojis: "✈️ 🍸 🎹 💔",
    imdbID: "tt0034583",
    frenchTitle: "Casablanca",
    genre: "Romance",
    year: 1942,
    director: "Michael Curtiz",
    mainActor: "Humphrey Bogart"
  },
  {
    id: 33,
    title: "Gladiator",
    emojis: "⚔️ 🏛️ 🦁 👑",
    imdbID: "tt0172495",
    frenchTitle: "Gladiator",
    genre: "Action",
    year: 2000,
    director: "Ridley Scott",
    mainActor: "Russell Crowe"
  },
  {
    id: 34,
    title: "The Breakfast Club",
    emojis: "🏫 🧠 🤘 📚",
    imdbID: "tt0088847",
    frenchTitle: "Breakfast Club",
    genre: "Drama",
    year: 1985,
    director: "John Hughes",
    mainActor: "Emilio Estevez"
  },
  {
    id: 35,
    title: "Psycho",
    emojis: "🏨 🚿 🔪 👩",
    imdbID: "tt0054215",
    frenchTitle: "Psychose",
    genre: "Horror",
    year: 1960,
    director: "Alfred Hitchcock",
    mainActor: "Anthony Perkins"
  },
  {
    id: 36,
    title: "Goodfellas",
    emojis: "🔫 💰 🍝 🤵",
    imdbID: "tt0099685",
    frenchTitle: "Les Affranchis",
    genre: "Crime",
    year: 1990,
    director: "Martin Scorsese",
    mainActor: "Robert De Niro"
  },
  {
    id: 37,
    title: "The Exorcist",
    emojis: "👧 😈 ✝️ 🤮",
    imdbID: "tt0070047",
    frenchTitle: "L'Exorciste",
    genre: "Horror",
    year: 1973,
    director: "William Friedkin",
    mainActor: "Ellen Burstyn"
  },
  {
    id: 38,
    title: "Singin' in the Rain",
    emojis: "🎭 🎬 🌧️ ☂️",
    imdbID: "tt0045152",
    frenchTitle: "Chantons sous la pluie",
    genre: "Musical",
    year: 1952,
    director: "Gene Kelly",
    mainActor: "Gene Kelly"
  },
  {
    id: 39,
    title: "Schindler's List",
    emojis: "📜 🏭 ✡️ 🖤",
    imdbID: "tt0108052",
    frenchTitle: "La Liste de Schindler",
    genre: "Drama",
    year: 1993,
    director: "Steven Spielberg",
    mainActor: "Liam Neeson"
  },
  {
    id: 40,
    title: "Gone with the Wind",
    emojis: "💃 🔥 🏠 💨",
    imdbID: "tt0031381",
    frenchTitle: "Autant en emporte le vent",
    genre: "Romance",
    year: 1939,
    director: "Victor Fleming",
    mainActor: "Clark Gable"
  },
  {
    id: 41,
    title: "Citizen Kane",
    emojis: "🛷 📰 🏰 🌹",
    imdbID: "tt0033467",
    frenchTitle: "Citizen Kane",
    genre: "Drama",
    year: 1941,
    director: "Orson Welles",
    mainActor: "Orson Welles"
  },
  {
    id: 42,
    title: "The Truman Show",
    emojis: "📺 🌍 🚪 ⛵",
    imdbID: "tt0120382",
    frenchTitle: "The Truman Show",
    genre: "Drama",
    year: 1998,
    director: "Peter Weir",
    mainActor: "Jim Carrey"
  },
  {
    id: 43,
    title: "The Green Mile",
    emojis: "👮 🐭 💡 👨‍⚖️",
    imdbID: "tt0120689",
    frenchTitle: "La Ligne verte",
    genre: "Drama",
    year: 1999,
    director: "Frank Darabont",
    mainActor: "Tom Hanks"
  },
  {
    id: 44,
    title: "A Clockwork Orange",
    emojis: "👁️ 🥛 🎭 🎩",
    imdbID: "tt0066921",
    frenchTitle: "Orange mécanique",
    genre: "Science-Fiction",
    year: 1971,
    director: "Stanley Kubrick",
    mainActor: "Malcolm McDowell"
  },
  {
    id: 45,
    title: "Apocalypse Now",
    emojis: "🚁 🌴 🔫 🚤",
    imdbID: "tt0078788",
    frenchTitle: "Apocalypse Now",
    genre: "War",
    year: 1979,
    director: "Francis Ford Coppola",
    mainActor: "Martin Sheen"
  },
  {
    id: 46,
    title: "Good Will Hunting",
    emojis: "🧹 🧮 🧠 💬",
    imdbID: "tt0119217",
    frenchTitle: "Will Hunting",
    genre: "Drama",
    year: 1997,
    director: "Gus Van Sant",
    mainActor: "Matt Damon"
  },
  {
    id: 47,
    title: "Die Hard",
    emojis: "🏢 🔫 💣 👞",
    imdbID: "tt0095016",
    frenchTitle: "Piège de cristal",
    genre: "Action",
    year: 1988,
    director: "John McTiernan",
    mainActor: "Bruce Willis"
  },
  {
    id: 48,
    title: "Saving Private Ryan",
    emojis: "🏖️ 🪖 🔫 ✉️",
    imdbID: "tt0120815",
    frenchTitle: "Il faut sauver le soldat Ryan",
    genre: "War",
    year: 1998,
    director: "Steven Spielberg",
    mainActor: "Tom Hanks"
  },
  {
    id: 49,
    title: "The Social Network",
    emojis: "💻 👥 💰 📱",
    imdbID: "tt1285016",
    frenchTitle: "The Social Network",
    genre: "Drama",
    year: 2010,
    director: "David Fincher",
    mainActor: "Jesse Eisenberg"
  },
  {
    id: 50,
    title: "Interstellar",
    emojis: "🌌 ⏰ 👨‍👧 🌽",
    imdbID: "tt0816692",
    frenchTitle: "Interstellar",
    genre: "Science-Fiction",
    year: 2014,
    director: "Christopher Nolan",
    mainActor: "Matthew McConaughey"
  },
  {
    id: 51,
    title: "A Beautiful Mind",
    emojis: "🧠 📝 🔢 👨‍🏫",
    imdbID: "tt0268978",
    frenchTitle: "Un homme d'exception",
    genre: "Drama",
    year: 2001,
    director: "Ron Howard",
    mainActor: "Russell Crowe"
  },
  {
    id: 52,
    title: "Braveheart",
    emojis: "⚔️ 🏴󠁧󠁢󠁳󠁣󠁴󠁿 👨‍👩‍👧‍👦 💔",
    imdbID: "tt0112573",
    frenchTitle: "Braveheart",
    genre: "Drama",
    year: 1995,
    director: "Mel Gibson",
    mainActor: "Mel Gibson"
  },
  {
    id: 53,
    title: "The Grand Budapest Hotel",
    emojis: "🏨 📦 🖼️ 🧁",
    imdbID: "tt2278388",
    frenchTitle: "The Grand Budapest Hotel",
    genre: "Comedy",
    year: 2014,
    director: "Wes Anderson",
    mainActor: "Ralph Fiennes"
  },
  {
    id: 54,
    title: "Spirited Away",
    emojis: "👧 🐉 🏮 🐖",
    imdbID: "tt0245429",
    frenchTitle: "Le Voyage de Chihiro",
    genre: "Animation",
    year: 2001,
    director: "Hayao Miyazaki",
    mainActor: "Rumi Hiiragi"
  },
  {
    id: 55,
    title: "No Country for Old Men",
    emojis: "💰 🔫 🤠 💨",
    imdbID: "tt0477348",
    frenchTitle: "No Country for Old Men",
    genre: "Thriller",
    year: 2007,
    director: "Joel Coen",
    mainActor: "Tommy Lee Jones"
  },
  {
    id: 56,
    title: "The Departed",
    emojis: "👮 🔫 🕶️ ☘️",
    imdbID: "tt0407887",
    frenchTitle: "Les Infiltrés",
    genre: "Crime",
    year: 2006,
    director: "Martin Scorsese",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 57,
    title: "La La Land",
    emojis: "🎹 💃 🌆 💫",
    imdbID: "tt3783958",
    frenchTitle: "La La Land",
    genre: "Musical",
    year: 2016,
    director: "Damien Chazelle",
    mainActor: "Ryan Gosling"
  },
  {
    id: 58,
    title: "Juno",
    emojis: "👧 👶 📞 ❤️",
    imdbID: "tt0467406",
    frenchTitle: "Juno",
    genre: "Comedy",
    year: 2007,
    director: "Jason Reitman",
    mainActor: "Elliot Page"
  },
  {
    id: 59,
    title: "Parasite",
    emojis: "👨‍👩‍👧‍👦 🏠 👨‍👩‍👧‍👦 🌧️",
    imdbID: "tt6751668",
    frenchTitle: "Parasite",
    genre: "Thriller",
    year: 2019,
    director: "Bong Joon-ho",
    mainActor: "Song Kang-ho"
  },
  {
    id: 60,
    title: "Whiplash",
    emojis: "🥁 👨‍🏫 🩸 🎵",
    imdbID: "tt2582802",
    frenchTitle: "Whiplash",
    genre: "Drama",
    year: 2014,
    director: "Damien Chazelle",
    mainActor: "Miles Teller"
  },
  {
    id: 61,
    title: "The Sound of Music",
    emojis: "👩‍👧‍👧 🎵 ⛰️ 🎭",
    imdbID: "tt0059742",
    frenchTitle: "La Mélodie du bonheur",
    genre: "Musical",
    year: 1965,
    director: "Robert Wise",
    mainActor: "Julie Andrews"
  },
  {
    id: 62,
    title: "12 Angry Men",
    emojis: "👨‍⚖️ 🔪 💦 ⚖️",
    imdbID: "tt0050083",
    frenchTitle: "Douze hommes en colère",
    genre: "Drama",
    year: 1957,
    director: "Sidney Lumet",
    mainActor: "Henry Fonda"
  },
  {
    id: 63,
    title: "Slumdog Millionaire",
    emojis: "💰 👦 📺 ❓",
    imdbID: "tt1010048",
    frenchTitle: "Slumdog Millionaire",
    genre: "Drama",
    year: 2008,
    director: "Danny Boyle",
    mainActor: "Dev Patel"
  },
  {
    id: 64,
    title: "When Harry Met Sally",
    emojis: "👨 👱‍♀️ 🍽️ ❤️",
    imdbID: "tt0098635",
    frenchTitle: "Quand Harry rencontre Sally",
    genre: "Romance",
    year: 1989,
    director: "Rob Reiner",
    mainActor: "Billy Crystal"
  },
  {
    id: 65,
    title: "The Sixth Sense",
    emojis: "👦 👻 👨‍⚕️ 💀",
    imdbID: "tt0167404",
    frenchTitle: "Sixième Sens",
    genre: "Thriller",
    year: 1999,
    director: "M. Night Shyamalan",
    mainActor: "Bruce Willis"
  },
  {
    id: 66,
    title: "Eternal Sunshine of the Spotless Mind",
    emojis: "🧠 💔 ❄️ 🛌",
    imdbID: "tt0338013",
    frenchTitle: "Eternal Sunshine of the Spotless Mind",
    genre: "Drama",
    year: 2004,
    director: "Michel Gondry",
    mainActor: "Jim Carrey"
  },
  {
    id: 67,
    title: "Life of Pi",
    emojis: "🚢 🐯 🌊 🛶",
    imdbID: "tt0454876",
    frenchTitle: "L'Odyssée de Pi",
    genre: "Adventure",
    year: 2012,
    director: "Ang Lee",
    mainActor: "Suraj Sharma"
  },
  {
    id: 68,
    title: "Cast Away",
    emojis: "✈️ 🏝️ 🏐 📦",
    imdbID: "tt0162222",
    frenchTitle: "Seul au monde",
    genre: "Drama",
    year: 2000,
    director: "Robert Zemeckis",
    mainActor: "Tom Hanks"
  },
  {
    id: 69,
    title: "Memento",
    emojis: "📷 🧠 🔍 📝",
    imdbID: "tt0209144",
    frenchTitle: "Memento",
    genre: "Thriller",
    year: 2000,
    director: "Christopher Nolan",
    mainActor: "Guy Pearce"
  },
  {
    id: 70,
    title: "Groundhog Day",
    emojis: "🔄 ⏰ 🦔 ❄️",
    imdbID: "tt0107048",
    frenchTitle: "Un jour sans fin",
    genre: "Comedy",
    year: 1993,
    director: "Harold Ramis",
    mainActor: "Bill Murray"
  },
  {
    id: 71,
    title: "The Prestige",
    emojis: "🎩 🕊️ 💡 👯‍♂️",
    imdbID: "tt0482571",
    frenchTitle: "Le Prestige",
    genre: "Thriller",
    year: 2006,
    director: "Christopher Nolan",
    mainActor: "Christian Bale"
  },
  {
    id: 72,
    title: "The Big Lebowski",
    emojis: "🎳 🥃 🧔 🧦",
    imdbID: "tt0118715",
    frenchTitle: "The Big Lebowski",
    genre: "Comedy",
    year: 1998,
    director: "Joel Coen",
    mainActor: "Jeff Bridges"
  },
  {
    id: 73,
    title: "Ratatouille",
    emojis: "🐀 👨‍🍳 🍲 🇫🇷",
    imdbID: "tt0382932",
    frenchTitle: "Ratatouille",
    genre: "Animation",
    year: 2007,
    director: "Brad Bird",
    mainActor: "Patton Oswalt"
  },
  {
    id: 74,
    title: "Her",
    emojis: "📱 👨 ❤️ 🗣️",
    imdbID: "tt1798709",
    frenchTitle: "Her",
    genre: "Drama",
    year: 2013,
    director: "Spike Jonze",
    mainActor: "Joaquin Phoenix"
  },
  {
    id: 75,
    title: "American Beauty",
    emojis: "🌹 👧 👨 💼",
    imdbID: "tt0169547",
    frenchTitle: "American Beauty",
    genre: "Drama",
    year: 1999,
    director: "Sam Mendes",
    mainActor: "Kevin Spacey"
  },
  {
    id: 76,
    title: "The Notebook",
    emojis: "📔 💏 🌧️ 👵",
    imdbID: "tt0332280",
    frenchTitle: "N'oublie jamais",
    genre: "Romance",
    year: 2004,
    director: "Nick Cassavetes",
    mainActor: "Ryan Gosling"
  },
  {
    id: 77,
    title: "Into the Wild",
    emojis: "🏕️ 🚌 🌲 🐻",
    imdbID: "tt0758758",
    frenchTitle: "Into the Wild",
    genre: "Adventure",
    year: 2007,
    director: "Sean Penn",
    mainActor: "Emile Hirsch"
  },
  {
    id: 78,
    title: "The Pianist",
    emojis: "🎹 🎭 🔫 🏚️",
    imdbID: "tt0253474",
    frenchTitle: "Le Pianiste",
    genre: "Drama",
    year: 2002,
    director: "Roman Polanski",
    mainActor: "Adrien Brody"
  },
  {
    id: 79,
    title: "Monsters, Inc.",
    emojis: "👹 👧 🚪 💨",
    imdbID: "tt0198781",
    frenchTitle: "Monstres & Cie",
    genre: "Animation",
    year: 2001,
    director: "Pete Docter",
    mainActor: "John Goodman"
  },
  {
    id: 80,
    title: "Rocky",
    emojis: "🥊 🏃 🥚 🏙️",
    imdbID: "tt0075148",
    frenchTitle: "Rocky",
    genre: "Drama",
    year: 1976,
    director: "John G. Avildsen",
    mainActor: "Sylvester Stallone"
  },
  {
    id: 81,
    title: "The Great Gatsby",
    emojis: "💰 🥂 👔 💔",
    imdbID: "tt1343092",
    frenchTitle: "Gatsby le Magnifique",
    genre: "Drama",
    year: 2013,
    director: "Baz Luhrmann",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 82,
    title: "Black Swan",
    emojis: "🩰 👯‍♀️ 🖤 🪶",
    imdbID: "tt0947798",
    frenchTitle: "Black Swan",
    genre: "Thriller",
    year: 2010,
    director: "Darren Aronofsky",
    mainActor: "Natalie Portman"
  },
  {
    id: 83,
    title: "The King's Speech",
    emojis: "👑 🎙️ 👑 🗣️",
    imdbID: "tt1504320",
    frenchTitle: "Le Discours d'un roi",
    genre: "Drama",
    year: 2010,
    director: "Tom Hooper",
    mainActor: "Colin Firth"
  },
  {
    id: 84,
    title: "Up",
    emojis: "🎈 🏠 🐕 🏔️",
    imdbID: "tt1049413",
    frenchTitle: "Là-haut",
    genre: "Animation",
    year: 2009,
    director: "Pete Docter",
    mainActor: "Ed Asner"
  },
  {
    id: 85,
    title: "Seven",
    emojis: "7️⃣ 🔪 📦 🔍",
    imdbID: "tt0114369",
    frenchTitle: "Seven",
    genre: "Thriller",
    year: 1995,
    director: "David Fincher",
    mainActor: "Brad Pitt"
  },
  {
    id: 86,
    title: "Scarface",
    emojis: "🔫 💰 🏝️ ❄️",
    imdbID: "tt0086250",
    frenchTitle: "Scarface",
    genre: "Crime",
    year: 1983,
    director: "Brian De Palma",
    mainActor: "Al Pacino"
  },
  {
    id: 87,
    title: "The Wolf of Wall Street",
    emojis: "💵 🐺 🚢 💊",
    imdbID: "tt0993846",
    frenchTitle: "Le Loup de Wall Street",
    genre: "Biography",
    year: 2013,
    director: "Martin Scorsese",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 88,
    title: "The Martian",
    emojis: "👨‍🚀 🌱 🔴 🚀",
    imdbID: "tt3659388",
    frenchTitle: "Seul sur Mars",
    genre: "Science-Fiction",
    year: 2015,
    director: "Ridley Scott",
    mainActor: "Matt Damon"
  },
  {
    id: 89,
    title: "Catch Me If You Can",
    emojis: "✈️ 💰 🖋️ 👮",
    imdbID: "tt0264464",
    frenchTitle: "Arrête-moi si tu peux",
    genre: "Biography",
    year: 2002,
    director: "Steven Spielberg",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 90,
    title: "Amélie",
    emojis: "💌 👧 🇫🇷 ❤️",
    imdbID: "tt0211915",
    frenchTitle: "Le Fabuleux Destin d'Amélie Poulain",
    genre: "Romance",
    year: 2001,
    director: "Jean-Pierre Jeunet",
    mainActor: "Audrey Tautou"
  },
  {
    id: 91,
    title: "Inside Out",
    emojis: "😀 😢 😡 👧",
    imdbID: "tt2096673",
    frenchTitle: "Vice-Versa",
    genre: "Animation",
    year: 2015,
    director: "Pete Docter",
    mainActor: "Amy Poehler"
  },
  {
    id: 92,
    title: "The Revenant",
    emojis: "🐻 🏹 ❄️ 🌲",
    imdbID: "tt1663202",
    frenchTitle: "The Revenant",
    genre: "Adventure",
    year: 2015,
    director: "Alejandro G. Iñárritu",
    mainActor: "Leonardo DiCaprio"
  },
  {
    id: 93,
    title: "Avatar",
    emojis: "👽 🌳 🌌 🦿",
    imdbID: "tt0499549",
    frenchTitle: "Avatar",
    genre: "Science-Fiction",
    year: 2009,
    director: "James Cameron",
    mainActor: "Sam Worthington"
  },
  {
    id: 94,
    title: "Gravity",
    emojis: "👩‍🚀 🛰️ 🌍 🌠",
    imdbID: "tt1454468",
    frenchTitle: "Gravity",
    genre: "Thriller",
    year: 2013,
    director: "Alfonso Cuarón",
    mainActor: "Sandra Bullock"
  },
  {
    id: 95,
    title: "Coco",
    emojis: "💀 🎸 👨‍👦 🐕",
    imdbID: "tt2380307",
    frenchTitle: "Coco",
    genre: "Animation",
    year: 2017,
    director: "Lee Unkrich",
    mainActor: "Anthony Gonzalez"
  },
  {
    id: 96,
    title: "The Theory of Everything",
    emojis: "♿ 🔭 ⏱️ 💫",
    imdbID: "tt2980516",
    frenchTitle: "Une merveilleuse histoire du temps",
    genre: "Biography",
    year: 2014,
    director: "James Marsh",
    mainActor: "Eddie Redmayne"
  },
  {
    id: 97,
    title: "The Intouchables",
    emojis: "♿ 👨‍⚕️ 🎭 🏎️",
    imdbID: "tt1675434",
    frenchTitle: "Intouchables",
    genre: "Comedy",
    year: 2011,
    director: "Olivier Nakache",
    mainActor: "François Cluzet"
  },
  {
    id: 98,
    title: "Fargo",
    emojis: "❄️ 🔫 💰 🚔",
    imdbID: "tt0116282",
    frenchTitle: "Fargo",
    genre: "Crime",
    year: 1996,
    director: "Joel Coen",
    mainActor: "Frances McDormand"
  },
  // Additional movies continue...
  {
    id: 99,
    title: "The Good, the Bad and the Ugly",
    emojis: "🤠 🔫 💰 🏜️",
    imdbID: "tt0060196",
    frenchTitle: "Le Bon, la Brute et le Truand",
    genre: "Western",
    year: 1966,
    director: "Sergio Leone",
    mainActor: "Clint Eastwood"
  },
  {
    id: 100,
    title: "Star Wars: Episode V - The Empire Strikes Back",
    emojis: "⚔️ 🌌 👨‍👦 ❄️",
    imdbID: "tt0080684",
    frenchTitle: "Star Wars : Épisode V - L'Empire contre-attaque",
    genre: "Science-Fiction",
    year: 1980,
    director: "Irvin Kershner",
    mainActor: "Mark Hamill"
  },
  {
    id: 101,
    title: "Avengers: Endgame",
    emojis: "🧤 💎 ⌛ 🦸",
    imdbID: "tt4154796",
    frenchTitle: "Avengers: Endgame",
    genre: "Action",
    year: 2019,
    director: "Anthony Russo",
    mainActor: "Robert Downey Jr."
  },
  {
    id: 102,
    title: "Everything Everywhere All at Once",
    emojis: "🥯 👓 🧹 🪨",
    imdbID: "tt6710474",
    frenchTitle: "Everything Everywhere All at Once",
    genre: "Science-Fiction",
    year: 2022,
    director: "Daniels",
    mainActor: "Michelle Yeoh"
  },
  {
    id: 103,
    title: "Top Gun: Maverick",
    emojis: "✈️ 😎 🏍️ 🎯",
    imdbID: "tt1745960",
    frenchTitle: "Top Gun: Maverick",
    genre: "Action",
    year: 2022,
    director: "Joseph Kosinski",
    mainActor: "Tom Cruise"
  },
  {
    id: 104,
    title: "Joker",
    emojis: "🃏 🔫 📺 🕺",
    imdbID: "tt7286456",
    frenchTitle: "Joker",
    genre: "Drama",
    year: 2019,
    director: "Todd Phillips",
    mainActor: "Joaquin Phoenix"
  }
];

// Helper function to get decade string
export const getDecade = (year: number): string => {
  const decade = Math.floor(year / 10) * 10;
  return `années ${decade}`;
};

// Helper function to get random movies for the game
export const getRandomMovies = (count: number = 7): Movie[] => {
  const shuffled = [...movies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to find a movie by title
export const findMovieByTitle = (title: string): Movie | undefined => {
  return movies.find(movie => movie.title === title);
};

// Helper function to get unique emojis for carousel
export const getUniqueEmojis = (limit: number = 10): string[] => {
  const uniqueEmojis = Array.from(new Set(movies.map(movie => movie.emojis)));
  return uniqueEmojis.slice(0, limit);
};