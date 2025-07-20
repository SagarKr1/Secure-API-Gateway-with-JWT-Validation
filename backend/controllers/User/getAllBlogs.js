const db = require('../../config/database');

module.exports.getApprovedBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(
            `SELECT * 
                FROM blog 
                WHERE is_verified = 1
                ORDER BY id DESC`
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


module.exports.getUnapprovedBlogs = async (req, res) => {
    try {
        const [blogs] = await db.query(
            `SELECT *
                FROM blog 
                WHERE is_verified = 0
                ORDER BY id DESC`
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
