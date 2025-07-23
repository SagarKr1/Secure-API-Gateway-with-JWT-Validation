const db = require('../../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('../mail/mailAuth');
require('dotenv').config();

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: false, body: 'Email is required.' });
        }

        // 1️⃣ Check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ status: false, body: 'No account found with that email.' });
        }

        const user = rows[0];

        if ([1, 2, 3].includes(Number(user.id))) {
            return res.status(404).json({
                status: false,
                body: "Not allowed to make changes to this user"
            });
        }

        // 2️⃣ Generate a new random password
        const newPassword = crypto.randomBytes(6).toString('hex'); // e.g. "a1b2c3d4e5f6"

        // 3️⃣ Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4️⃣ Store the new hashed password in DB
        await db.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
        );

        const mailOptions = {
            from: `"Security Blog" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your New Password - Action Required',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello ${user.name || 'User'},</h2>

            <p>We received a request to reset your password for your account registered with this email: <strong>${user.email}</strong>.</p>

            <p>Your new temporary password is:</p>
            <div style="background: #f2f2f2; padding: 10px; display: inline-block; font-size: 16px;">
                <strong>${newPassword}</strong>
            </div>

            <p><strong>Please log in using this new password as soon as possible.</strong> For your security, we strongly recommend that you change this password immediately after logging in.</p>

            <p>If you did not request this reset, please contact our support team immediately.</p>

            <p>Best regards,<br>Your App Support Team</p>

            <hr style="margin-top: 20px;"/>
            <small>If you have any questions or need help, please reach out to <a href="mailto:support@yourapp.com">support@yourapp.com</a>.</small>
            </div>
        `
        };

        await nodemailer.sendMail(mailOptions);

        return res.json({ status: true, body: 'A new password has been generated and sent to your email address.' });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: false, body: 'Server error.' });
    }
};
