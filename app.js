require('dotenv').config();
const express = require("express");
const cors = require('cors');
const app = express();

const quotes = require('./src/api/quotes');
const authRoutes = require('./src/api/user-authentication');
const comments = require('./src/api/comments');
const likes = require('./src/api/likes');
const userProfile = require('./src/api/user-profile');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/auth', authRoutes);
app.use('/api', quotes);
app.use('/api', comments);
app.use('/api', likes);
app.use('/api', userProfile);


app.listen(PORT, () =>
{
    console.log(`Server is running on http://localhost:${ PORT }`);
});