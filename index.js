const express = require('express');
const { success } = require('./Utils/ResponseWrapper');
const dotenv = require('dotenv');
const connectDB = require('./DbConnect');
dotenv.config({ path: './.env' });

const Api = require('./Router/Api');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getOriginalUrlController } = require('./Controller/UrlController');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'*',
    credentials: true // Required for cookies to be sent cross-origin
}));

// Routes
app.get('/', (req, res) => {
    res.send(success(200, 'CraftURL Server is running.'));
});

app.use('/api', Api);

// Short URL redirect (public — no auth required)
app.get('/:id', getOriginalUrlController);

const port = process.env.PORT || 4000;
connectDB();

app.listen(port, () => {
    console.log(`CraftURL server running on port ${port}`);
});
