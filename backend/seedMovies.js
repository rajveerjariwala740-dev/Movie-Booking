require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const connectDB = require('./config/db');

const movies = [
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    rating: 4.8,
    genre: "Action",
    duration: 166,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400",
    language: "English"
  },
  {
    title: "Blade Runner 2049",
    description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    rating: 4.7,
    genre: "Sci-fi",
    duration: 164,
    poster: "https://images.unsplash.com/photo-1542204165-62bf26472b9b?q=80&w=400&auto=format&fit=crop",
    language: "English"
  },
  {
    title: "Guardians of the Galaxy",
    description: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    rating: 4.5,
    genre: "Comedy",
    duration: 121,
    poster: "https://images.unsplash.com/photo-1561149877-84d268ba65b8?q=80&w=400&auto=format&fit=crop",
    language: "English"
  },
  {
    title: "Hereditary",
    description: "A grieving family is haunted by tragic and disturbing occurrences.",
    rating: 4.3,
    genre: "Horror",
    duration: 127,
    poster: "https://images.unsplash.com/photo-1557245991-384351b6dbb5?q=80&w=400&auto=format&fit=crop",
    language: "English"
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 4.9,
    genre: "Sci-fi",
    duration: 169,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop",
    language: "English"
  }
];

const seed = async () => {
    try {
        await connectDB();
        // clear existing movies
        await Movie.deleteMany();
        console.log("Deleted old movies.");
        await Movie.insertMany(movies);
        console.log("Movies seeded!");
        process.exit(0);
    } catch(err) {
        console.error("Seeding error", err);
        process.exit(1);
    }
}
seed();
