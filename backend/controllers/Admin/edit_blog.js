const db = require('../../config/database');

module.exports.editBlog = async (req, res) => {
    try {
        const { blog_id, creator_id, title, image, description } = req.body;

        if (!blog_id || !creator_id || !title || !image || !description) {
            return res.status(400).json({
                status: false,
                body: "blog_id, creator_id, title, image, and description are required"
            });
        }

        // Get creator_id AND creator_role
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

        const creatorRole = blogs[0].creator_role;

        if (creatorRole === 'admin' || creatorRole === 'subadmin') {
            // Admin/subadmin edits — always approved
            await db.query(
                `UPDATE blog 
         SET title = ?, image = ?, description = ?, is_verified = TRUE, remarks = NULL
         WHERE id = ?`,
                [title, image, description, blog_id]
            );
        } else if (creatorRole === 'user') {
            // User edits — reset approval
            await db.query(
                `UPDATE blog 
         SET title = ?, image = ?, description = ?, is_verified = FALSE, remarks = NULL
         WHERE id = ?`,
                [title, image, description, blog_id]
            );
        } else {
            return res.status(400).json({
                status: false,
                body: "Invalid creator role"
            });
        }

        return res.json({
            status: true,
            body: `Blog updated successfully. Role: ${creatorRole}`
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
