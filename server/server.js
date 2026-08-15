
const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const createError = require("http-errors");
const pool = require("./config/connection");

const contactRoute = require("./routes/contact");

dotenv.config();
const PORT = process.env.PORT;

app.use(morgan('dev'));
app.use(cors({
    origin: true,
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use('/api/contact', contactRoute);

app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
})