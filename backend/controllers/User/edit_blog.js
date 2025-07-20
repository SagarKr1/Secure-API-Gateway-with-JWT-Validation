const db = require('../../config/database');

module.exports.editBlogByUser = async (req, res) => {
    try {
        const { blog_id, creator_id, title, image, description } = req.body;

        if (!blog_id || !creator_id || !title || !image || !description) {
            return res.status(400).json({
                status: false,
                body: "blog_id, creator_id, title, image, and description are required"
            });
        }

        // Check if the blog exists, belongs to the user, and role is 'user'
        const [blogs] = await db.query(
            `SELECT creator_id, creator_role FROM blog WHERE id = ?`,
            [blog_id]
        );

        if (blogs.length === 0) {
            return res.status(404).json({
                status: false,
                body: "Blog not found"
            });
        }

        if (blogs[0].creator_id !== parseInt(creator_id)) {
            return res.status(403).json({
                status: false,
                body: "You are not authorized to edit this blog"
            });
        }

        if (blogs[0].creator_role !== 'user') {
            return res.status(403).json({
                status: false,
                body: "Only blogs created by user can be edited with this API"
            });
        }

        await db.query(
            `UPDATE blog 
       SET title = ?, image = ?, description = ?, is_verified = FALSE, remarks = NULL
       WHERE id = ?`,
            [title, image, description, blog_id]
        );

        return res.json({
            status: true,
            body: "Blog updated successfully. Approval status reset."
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
