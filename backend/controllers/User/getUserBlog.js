const db = require('../../config/database');

module.exports.getBlogsByCreator = async (req, res) => {
    try {
        const { creator_id } = req.params;

        if (!creator_id) {
            return res.status(400).json({
                status: false,
                body: "creator_id is required"
            });
        }

        const [blogs] = await db.query(
            `SELECT * 
                FROM blog 
                WHERE creator_id = ? AND creator_role = 'user'
                ORDER BY id DESC`,
            [creator_id]
        );


        if (blogs.length === 0) {
            return res.status(404).json({
                status: false,
                body: "No blogs found for this creator"
            });
        }

        return res.json({
            status: true,
            body: blogs
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
