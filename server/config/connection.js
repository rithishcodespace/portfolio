require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL
});

// only when a query runs, connection will be established
pool.on("connect", () => {
    console.log("PostgreSQL connected");
});

pool.on("error", (error) => {
    console.error("PostgreSQL error:", error);
});

module.exports = pool;