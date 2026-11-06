require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.SUPABASE_URL || process.env.LOCAL_DATABASE_URL;
const isSupabase = connectionString && connectionString.includes("supabase");

const pool = new Pool({
    connectionString,
    ssl: isSupabase ? { rejectUnauthorized: false } : false
});

// only when a query runs, connection will be established
pool.on("connect", () => {
    console.log("PostgreSQL connected");
});

pool.on("error", (error) => {
    console.error("PostgreSQL error:", error);
});

module.exports = pool;