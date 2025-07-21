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
            WHERE creator_id = ?
            ORDER BY timestamp DESC`,
            [creator_id]
        );

        if (blogs.length === 0) {
            return res.status(200).json({
                status: true,
                body: []
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
