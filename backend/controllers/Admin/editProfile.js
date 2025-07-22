const db = require('../../config/database');
const bcrypt = require('bcryptjs');


// Edit/update user
module.exports.editProfile = async (req, res) => {
    try {
        const {  name, email, phone } = req.body;
        const id = req.user.id;
        if (!id) {
            return res.status(400).json({
                status: false,
                body: 'User ID is required'
            });
        }

        const [result] = await db.query(
            'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
            [name, email, phone, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                body: 'User not found or no changes made'
            });
        }

        return res.status(200).json({
            status: true,
            body: 'User updated successfully'
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};


module.exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // authenticated user ID

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password required.' });
        }

        // 1️⃣ Get current hash
        const [rows] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ status:false,body: 'User not found.' });
        }

        const user = rows[0];

        // 2️⃣ Compare old password with hash
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ status:false,body: 'Current password is incorrect.' });
        }

        // 3️⃣ Hash new password
        const newHash = await bcrypt.hash(newPassword, 10);

        // 4️⃣ Update DB
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);

        return res.json({ status:true,body: 'Password changed successfully.' });

    } catch (e) {
        console.error(e);
        return res.status(500).json({status:false, body: 'Server error.' });
    }
};
