const Pool = require('pg').Pool;
require('dotenv').config();

//connection to db
const pool = new Pool({
    user: "postgres",
    password: process.env.DB_PASSWORD,
    database: "postgres",
    host: "localhost",
    port: 5432
});

module.exports = pool;