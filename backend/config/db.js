const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.log(`Postgresql Database connection failed: ${error.message}`);
    } else {
        console.log("Database connected successfully");
        console.log("Database timestamp:", result.rows[0].now);
    }
});

module.exports = pool;