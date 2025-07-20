const db = require('../../config/database');

module.exports.createBlogAdmin = async (req, res) => {
    try {
        const { creator_id, title, image, description } = req.body;

        if (!creator_id || !title || !image || !description) {
            return res.status(400).json({
                status: false,
                body: "Data should not be empty"
            });
        }

        const [creator] = await db.query(
            `SELECT name, role FROM users WHERE id = ?`,
            [creator_id]
        );

        // ✅ FIX: check if any row returned
        if (!creator || creator.length === 0) {
            return res.status(404).json({
                status: false,
                body: "Creator not found"
            });
        }

        const creatorName = creator[0].name;
        const creatorRole = creator[0].role;

        if (!creatorName || !creatorRole) {
            return res.status(400).json({
                status: false,
                body: "Invalid creator data"
            });
        }

        if (creatorRole === "user") {
            return res.status(403).json({
                status: false,
                body: "Normal users are not allowed to create blog via this API"
            });
        }

        // ✅ Approved by default for admin/subadmin
        const value = [
            title,
            image,
            description,
            creator_id,
            creatorName,
            creatorRole,
            true // is_verified
        ];

        const query = `
      INSERT INTO blog (title, image, description, creator_id, creator_name, creator_role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await db.query(query, value);

        return res.json({
            status: true,
            body: "Blog uploaded and approved successfully"
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
