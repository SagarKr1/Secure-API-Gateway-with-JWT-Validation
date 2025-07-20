const db = require('../../config/database');


module.exports.getAllUser = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT id,name,email,phone,is_verified,role,created_by,created_at FROM users where is_verified=true ORDER BY id DESC`);
        return res.json({
            status:true,
            body:rows
        })
    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        })
    }
}