const db = require('../../config/database');
const transporter = require('../../auth/mail/mailAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();


module.exports.CreateUser = async (req, res) => {
    try {
        const { name, email, phone, password, role, created_by } = req.body;
        if (!name || !email || !phone || !password || !role || !created_by) {
            return res.status(404).json({
                status: false,
                body: "Data should not be empty"
            });
        }

        const query = `select * from users where email=?`;
        const value = [email];
        const [row] = await db.query(query, value);

        if (row.length > 0 && row[0].is_verified) {
            return res.status(400).json({ status: false, body: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const qry = `INSERT INTO users (name,email, phone,password,role,created_by) 
                        VALUES (?, ?, ?, ?,?,?)`;
        const v = [name, email, phone, hashedPassword, role.toLowerCase(), created_by];
        const [data] = await db.query(qry, v);
        const insertedId = data.insertId;

        const json = {
            "id": insertedId,
            "email": email,
            "phone": phone
        };
        const token = jwt.sign(
            json,
            process.env.JWT_SECRET,
            { expiresIn: 600 }
        );
        const baseURL = process.env.FRONTEND_BASE_URL || "http://localhost:3000"
        const verificationLink = `${baseURL}/verify-email?token=${token}`;
        const mailOptions = {
            from: `"Security Blog" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email & Your Login Details - Security Blog',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; 
                            font-family: Arial, Helvetica, sans-serif; 
                            border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c3e50;">Welcome to Security Blog!</h2>
                <p style="font-size: 16px; color: #333;">
                    Hi ${name || 'there'},
                </p>
                <p style="font-size: 16px; color: #333;">
                    Thank you for registering. Please verify your email address to activate your account.
                </p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${verificationLink}" 
                    style="background-color: #1abc9c; color: #fff; 
                            text-decoration: none; padding: 12px 20px; 
                            border-radius: 5px; display: inline-block;"
                    target="_blank"
                            >
                    Verify Email
                    </a>
                </p>
                <p style="font-size: 16px; color: #333;">
                    <strong>Your login details:</strong><br/>
                    <strong>Email:</strong> ${email}<br/>
                    <strong>Password:</strong> ${password}
                </p>
                <p style="font-size: 14px; color: #f39c12;">
                    ⚠️ For your security, please change your password after logging in.
                </p>
                <p style="font-size: 14px; color: #666;">
                    If you did not create an account, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
                    — Security Blog Team
                </p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return res.json({
            status: true,
            body: "Verification email was sent successfully",
            url:verificationLink
        });
    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
}