const db = require('../../config/database');

module.exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // comes from middleware

        // 1️⃣ Find the blog
        const [rows] = await db.query('SELECT * FROM blog WHERE id = ?', [blogId]);

        if (rows.length === 0) {
            return res.status(404).json({ status:false,body: 'Blog not found' });
        }

        const blog = rows[0];

        // 2️⃣ Confirm creator matches logged-in user
        if (blog.creator_id !== userId) {
            return res.status(403).json({ status:false,body: 'Forbidden: You are not the creator' });
        }

        // 3️⃣ Delete
        await db.execute('DELETE FROM blog WHERE id = ?', [blogId]);

        return res.json({ message: 'Blog deleted successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
