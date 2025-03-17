const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const albumRoutes = require('./routes/albumRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const seedRoutes = require('./routes/seedRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);
app.use('/albums', albumRoutes);
app.use('/photos', photoRoutes);
app.use('/comments', commentRoutes);
app.use('/favorites', favoriteRoutes);
// Removed separate favorites route since it's now part of photos

app.use("/seed", seedRoutes)
module.exports = app;