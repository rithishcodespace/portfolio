const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const pool = require("./config/connection");

const contactRoute = require("./routes/contact");
const adminRoute = require("./routes/auth");
const trackingRoute = require("./routes/tracking");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/contact', contactRoute);
app.use('/api/admin', adminRoute);
app.use('/api/track', trackingRoute);

// health api
app.get('/api/health', (req,res) => {
    return res.status(200).json({
        message: "backend is healthy!!"
    })
});

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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`server started sucessfully on port:${PORT}`);
})