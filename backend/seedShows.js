require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Screen = require('./models/Screen');
const Show = require('./models/Show');
const connectDB = require('./config/db');

const seedShows = async () => {
    try {
        await connectDB();
        
        const movies = await Movie.find();
        if (movies.length === 0) {
            console.log("No movies found. Run seedMovies.js first.");
            process.exit(1);
        }

        // Clean up old
        await Theater.deleteMany({});
        await Screen.deleteMany({});
        await Show.deleteMany({});
        console.log("Cleaned up old theaters, screens, and shows.");

        const theater = await Theater.create({
            name: "CineVault Central",
            location: "Downtown Metropolis",
            type: "Multiplex"
        });

        const screen = await Screen.create({
            name: "Screen 1",
            seats: 96,
            type: "3D",
            theater: theater._id
        });

        theater.avilableScreens.push(screen._id);
        await theater.save();

        const theater2 = await Theater.create({
            name: "Starlight Cinema",
            location: "Uptown Plaza",
            type: "Open Air"
        });

        const screen2 = await Screen.create({
            name: "Screen A",
            seats: 60,
            type: "IMAX",
            theater: theater2._id
        });

        theater2.avilableScreens.push(screen2._id);
        await theater2.save();

        let showDate = new Date();
        showDate.setDate(showDate.getDate() + 1); // Tomorrow

        // Add shows for each movie in both theaters
        for (const movie of movies) {
            await Show.create({
                movie: movie._id,
                theater: theater._id,
                screen: screen._id,
                showDate: showDate,
                showTime: "19:00",
                price: 15
            });

            await Show.create({
                movie: movie._id,
                theater: theater2._id,
                screen: screen2._id,
                showDate: showDate,
                showTime: "21:30",
                price: 20
            });
        }
        
        console.log("Seeded Theaters, Screens, and Shows!");
        process.exit(0);
    } catch(err) {
        console.error("Seeding error", err);
        process.exit(1);
    }
}
seedShows();
