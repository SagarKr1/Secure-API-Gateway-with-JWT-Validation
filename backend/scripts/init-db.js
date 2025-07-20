const mysql = require('mysql2');
require('dotenv').config()

// Create connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, // Add your MySQL password here
});

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');

        // Create database if not exists
        await pool.promise().query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`);
        console.log(`Database ${process.env.DATABASE} created or already exists`);

        // Use the database
        await pool.promise().query(`USE ${process.env.DATABASE}`);

        // Create users table if not exists
        await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('user','subadmin','admin') DEFAULT 'user',
                is_verified BOOLEAN DEFAULT FALSE,
                created_by VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created or already exists');

        // Create blog table if not exists
        await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS blog (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                image TEXT NOT NULL,
                description TEXT NOT NULL,
                creator_id INT NOT NULL,
                creator_name VARCHAR(255) NOT NULL,
                creator_role VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('blog table created or already exists');

        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase(); 