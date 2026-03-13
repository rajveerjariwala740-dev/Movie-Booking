require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
const movieRouter = require('./routes/movieRoutes');
const theatreRouter = require('./routes/theatreRoutes');
const screenRouter = require('./routes/screenRoutes');
const showRouter = require('./routes/showRoutes');
const { router } = require('./routes/bookingRoutes');

const cors = require('cors');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/theatres', theatreRouter);
app.use('/api/screens', screenRouter);
app.use('/api/shows', showRouter);
app.use('/api/bookings', router);

const path = require('path');
// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

app.use(errorHandler);
(async () => {
    await connectDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
})()


