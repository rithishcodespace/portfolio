
const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const createError = require("http-errors");
dotenv.config();
const PORT = process.env.PORT;

app.use(cors());

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
})