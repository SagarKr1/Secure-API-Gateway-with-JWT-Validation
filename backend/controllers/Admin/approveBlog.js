const db = require('../../config/database');

module.exports.updateBlogApproval = async (req, res) => {
    try {
        const { blog_id, is_verified, remarks } = req.body;

        if (!blog_id || is_verified === undefined) {
            return res.status(400).json({
                status: false,
                body: "blog_id and is_verified are required"
            });
        }

        if (!remarks || remarks.trim() === '') {
            return res.status(400).json({
                status: false,
                body: "remarks are required"
            });
        }

        // Check if blog exists
        const [blogs] = await db.query(
            `SELECT creator_role FROM blog WHERE id = ?`,
            [blog_id]
        );

        if (blogs.length === 0) {
            return res.status(404).json({
                status: false,
                body: "Blog not found"
            });
        }

        const creatorRole = blogs[0].creator_role;

        if (creatorRole !== 'user' && creatorRole !== 'subadmin') {
            return res.status(403).json({
                status: false,
                body: "Only blogs created by user or subadmin can be approved/disapproved"
            });
        }

        await db.query(
            `UPDATE blog SET is_verified = ?, remarks = ? WHERE id = ?`,
            [is_verified ? 1 : 0, remarks, blog_id]
        );

        return res.json({
            status: true,
            body: `Blog ${is_verified ? 'approved' : 'disapproved'} successfully with remarks`
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
