const mysql = require('mysql2');
require('dotenv').config()
// Create the connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE
});

const promisePool = pool.promise();

module.exports = promisePool; 