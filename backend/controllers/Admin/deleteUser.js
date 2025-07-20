const db = require('../../config/database');

// Delete user by ID
module.exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: false,
                body: 'User ID is required'
            });
        }

        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                body: 'User not found'
            });
        }

        return res.status(200).json({
            status: true,
            body: 'User deleted successfully'
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};