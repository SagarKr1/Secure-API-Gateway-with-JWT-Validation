const db = require('../../config/database');
const jwt = require('jsonwebtoken');
const transporter = require('../mail/mailAuth');
const bcrypt = require('bcryptjs')
require('dotenv').config();

const generateOtp = async () => {
    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    return otp;
};

module.exports.forgotOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);
        if (!email) {
            console.log("email not found");
            return res.status(400).json({
                status: false,
                body: "Data should not be empty"
            });
        }
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(rows);
        if(!rows[0]){
            console.log("user not found");
            return res.status(404).json({
                status:false,
                body:"User not found"
            });
        }

        if(!rows[0].is_verified){
            console.log("User not verfied");
            return res.status(404).json({
                status:false,
                body:"User not found"
            });
        }

        const otp = await generateOtp();

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Your Verification OTP',
            html: `
                <div style="font-family: 'Arial', sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">

                <!-- Header Section -->
                <div style="background-color: #0044cc; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 30px; font-weight: bold;">SBTE</h1>
                    <p style="font-size: 18px; margin-top: 5px;">Government of Bihar</p>
                </div>

                <!-- Main Content -->
                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-top: 20px;">

                    <p style="font-size: 18px;">Dear User,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your SBTE account password. Please use the following One-Time Password (OTP) to proceed. This OTP is valid for <strong>5 minutes</strong>.</p>

                    <div style="text-align: center; margin: 20px 0;">
                        <h2 style="font-size: 36px; color: #0044cc; font-weight: bold; letter-spacing: 2px;">${otp}</h2>
                    </div>

                    <p style="font-size: 16px; line-height: 1.6;">If you did not request a password reset, you can safely ignore this email.</p>
                </div>

                <!-- Footer Section -->
                <div style="margin-top: 30px; text-align: center; color: #888; font-size: 14px;">
                    <p>&copy; 2025 SBTE - Government of Bihar. All rights reserved.</p>
                </div>

            </div>

            `
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent to email:', email);
        const otpToken = jwt.sign(
            { email, otp },
            process.env.secret,
            { expiresIn: '10m' }
        );
        
        await db.query(
            `UPDATE users
                SET otp = ?
                WHERE email = ?`,
            [otpToken, email]
        );

        return res.json({
            status:true,
            body:"Otp sent to "+email
        })


    } catch (e) {
        console.log("Error : ", e);
        return res.status(500).json({
            status: false,
            body: "Error " + e.message
        })
    }

}


module.exports.forgotPassward = async (req, res) => {
    try {
        const {email,password} = req.body;
        console.log(req.body);
        if(!email || !password){
            console.log("Data should not be empty");
            return res.status(400).json({
                status:false,
                body:"data should not be empty"
            })
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(rows);
        if(!rows[0]){
            console.log("user not found");
            return res.status(404).json({
                status:false,
                body:"User not found"
            });
        }

        if(!rows[0].is_verified || !rows[0].otp){
            console.log("User not verfied");
            return res.status(404).json({
                status:false,
                body:"User not verified"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `UPDATE users
                SET password = ?
                WHERE email = ?`,
            [hashedPassword, email]
        );

        return res.json({
            status:true,
            body:"Password Change"
        })
    } catch (e) {
        console.log("Error : ", e);
        return res.status(500).json({
            status: false,
            body: "Error " + e.message
        })
    }

}