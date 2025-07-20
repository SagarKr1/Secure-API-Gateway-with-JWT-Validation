const jwt = require('jsonwebtoken');
const db = require('../../config/database');
require('dotenv').config();

module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                status: false,
                body: "Token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !decoded.email) {
            return res.status(400).json({
                status: false,
                body: "Invalid token"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM users WHERE id = ?`,
            [decoded.id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                status: false,
                body: "User not found"
            });
        }

        // Update user
        await db.query(
            `UPDATE users SET is_verified = ? WHERE id = ?`,
            [true, decoded.id]
        );

        return res.status(200).json({
            status: true,
            body: "Email verified successfully"
        });

    } catch (e) {
        console.error("Error in verifyEmail:", e);
        return res.status(400).json({
            status: false,
            body: "Link expired or invalid"
        });
    }
};
