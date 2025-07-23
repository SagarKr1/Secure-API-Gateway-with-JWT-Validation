const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
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
        console.log('Blog table created or already exists');

        // Insert default users (if they don't exist)
        const [existingUsers] = await pool.promise().query(`SELECT * FROM users`);
        if (existingUsers.length === 0) {
            // Hash passwords
            const adminPassword = await bcrypt.hash('admin@1234', 10);
            const subadminPassword = await bcrypt.hash('subAdmin@1234', 10);
            const userPassword = await bcrypt.hash('user@1234', 10);

            await pool.promise().query(`
        INSERT INTO users (name, email, phone, password, role, is_verified, created_by)
        VALUES
            ('Admin User', 'admin@example.com', '1111111111', '${adminPassword}', 'admin', true, 'system'),
            ('Subadmin User', 'subadmin@example.com', '2222222222', '${subadminPassword}', 'subadmin', true, 'system'),
            ('Normal User', 'user@example.com', '3333333333', '${userPassword}', 'user', true, 'system')
        `);
            console.log('Inserted admin, subadmin, and normal user with hashed passwords and is_verified = true');
        } else {
            console.log('Users already exist, skipping insert');
        }

        // Insert blogs with is_verified = true
        const [existingBlogs] = await pool.promise().query(`SELECT * FROM blog`);
        if (existingBlogs.length === 0) {
            // Get user IDs
            const [users] = await pool.promise().query(`SELECT id, name, role FROM users`);
            const admin = users.find(u => u.role === 'admin');
            const subadmin = users.find(u => u.role === 'subadmin');
            const user = users.find(u => u.role === 'user');

            const blogs = [
                {
                    title: 'Understanding Zero Trust Security',
                    image: 'https://cdn.prod.website-files.com/65d56fe4a7a28c8df8170c81/66d5c0958e513ad08ad3495f_zero-trust.jpg',
                    description: `Zero Trust is a modern security model that assumes no user or device, inside or outside the network, can be trusted by default. Admins must implement strict identity verification and least privilege principles. This blog explains how Zero Trust works, why it matters in 2025’s cloud-first world, and how businesses can adopt it in phases — covering identity, device management, network segmentation, and continuous monitoring. Zero Trust reduces the blast radius of breaches and limits lateral movement for attackers.`,
                    creator: admin
                },
                {
                    title: 'How to Build a Strong Incident Response Plan',
                    image: 'https://cdn.prod.website-files.com/6684006d24d0b88a766eb2f3/66be0572345b7625caaf848e_cbfcc0_d9f2b77899c64140b6d1be46df45b679~mv2.jpeg',
                    description: `A strong Incident Response (IR) plan is critical for minimizing damage during a cyber attack. This admin guide covers the 6 phases: preparation, identification, containment, eradication, recovery, and lessons learned. It explains how to build a skilled IR team, define clear roles, maintain an updated contact list, and practice your plan through tabletop exercises. Real-world case studies illustrate how fast, decisive action can stop an attack from becoming a disaster. Keep your IR plan tested and ready.`,
                    creator: admin
                },
                {
                    title: 'Top 5 Social Engineering Tactics',
                    image: 'https://i.ytimg.com/vi/jQpTYfYFtTs/sddefault.jpg?v=6213b0ae',
                    description: `Social engineering remains one of the biggest threats to organizations because it targets human weaknesses. In this post, the subadmin explains the top 5 tactics: phishing, baiting, pretexting, tailgating, and quid pro quo. Each example includes real stories showing how attackers use manipulation to steal credentials or deploy malware. The blog provides actionable training tips to help employees recognize suspicious requests and report incidents. Awareness is key to defeating social engineering attacks.`,
                    creator: subadmin
                },
                {
                    title: 'Multi-Factor Authentication Explained',
                    image: 'https://cdn.prod.website-files.com/5ff66329429d880392f6cba2/618e22145ecb022084a55702_Multi%20factor%20Authentication%20%20Preview.png',
                    description: `Multi-Factor Authentication (MFA) adds a critical security layer by requiring more than a password to verify identity. The subadmin explains different MFA types — SMS codes, authenticator apps, biometrics — and the pros and cons of each. The blog also discusses best practices for rolling out MFA across an organization, addressing user experience, and avoiding common pitfalls. Real breach examples show why password-only security is no longer enough. Organizations that enforce MFA significantly reduce account compromise risk.`,
                    creator: subadmin
                },
            ];

            for (let i = 1; i <= 6; i++) {
                blogs.push({
                    title: `Security Tip`,
                    image: `https://www.cyberdb.co/wp-content/uploads/2022/03/tips.png`,
                    description: `This user-written blog shares practical cybersecurity advice for individuals. It highlights daily habits that protect accounts and data: using unique passwords for every site, keeping software updated, being cautious about public Wi-Fi, verifying website security (HTTPS), avoiding suspicious links, and understanding basic privacy settings on social media. Each tip empowers non-technical people to stay safe online. Practicing these simple steps makes it harder for attackers to succeed and keeps personal and work data secure.`,
                    creator: user
                });
            }

            const blogValues = blogs.map(blog =>
                `('${blog.title}', '${blog.image}', '${blog.description.replace(/'/g, "\\'")}', ${blog.creator.id}, '${blog.creator.name}', '${blog.creator.role}', true)`
            ).join(',\n');

            await pool.promise().query(`
        INSERT INTO blog (title, image, description, creator_id, creator_name, creator_role, is_verified)
        VALUES ${blogValues}
        `);

            console.log('Inserted 10 cybersecurity blogs: 2 by admin, 2 by subadmin, 6 by user — all verified');
        } else {
            console.log('Blogs already exist, skipping insert');
        }

        console.log('✅ Database initialization complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase();
