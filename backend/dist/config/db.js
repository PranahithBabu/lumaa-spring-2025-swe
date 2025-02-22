"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config"); // Load environment variables
// Define the database configuration object
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432, // Default PostgreSQL port
});
// Connect to the database
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Database connection error:', err));
exports.default = pool;
