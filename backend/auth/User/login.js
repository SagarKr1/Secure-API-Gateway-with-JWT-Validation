const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();


module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (!email || !password) {
            console.log("Email and Password are required");
            return res.status(400).json({
                status: false,
                body: "data should not be empty"
            });
        }
        const query = `select * from users where email=? and is_verified=true`;
        const value = [email];
        const [user] = await db.query(query, value);
        console.log(user[0]);
        if (!user[0]) {
            console.log("User not found");
            return res.status(400).json({
                status: false,
                body: "User not found"
            });
        }

        const hash = user[0].password

        const checkPass = await bcrypt.compareSync(password, hash);
        console.log("checkPass = ", checkPass);
        if (!checkPass) {
            console.log("Wrong password");
            return res.status(404).json({
                status: false,
                body: "Wrong password"
            });
        }
        const data = {
            "name": user[0].name,
            "email": user[0].email,
            "role": user[0].role,
            "phone":user[0].phone,
            "is_verified":user[0].is_verified,
            "created_by":user[0].created_by,
            "create_at":user[0].created_at
        }
        var token = jwt.sign(
            data,
            process.env.JWT_SECRET,
            { expiresIn: 30 * 24 * 60 * 60 }
        );

        return res.json({
            status: true,
            body: token
        })
    } catch (e) {
        console.log("Login Error :" + e);
        return res.status(500).json({
            status: false,
            body: "Error :" + e.message
        });
    }
}