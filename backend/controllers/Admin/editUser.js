const db = require('../../config/database');

// Edit/update user
module.exports.editUser = async (req, res) => {
    try {
        const { id, name, email, phone, role } = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                body: 'User ID is required'
            });
        }

        if ([1, 2, 3].includes(Number(id))) {
            return res.status(404).json({
                status: false,
                body: "Not allowed to make changes to this user"
            });
        }

        const [result] = await db.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?',
            [name, email, phone, role, id]
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
