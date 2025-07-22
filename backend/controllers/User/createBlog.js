const db = require('../../config/database');

module.exports.createBlogUser = async (req, res) => {
    try {
        const { title, image, description } = req.body;
        const creator_id = req.user.id;
        if (!creator_id || !title || !image || !description) {
            return res.status(400).json({
                status: false,
                body: "Data should not be empty"
            });
        }

        const [creator] = await db.query(`SELECT name, role FROM users WHERE id = ?`, [creator_id]);

        // ✅ FIXED: check if any user was found
        if (!creator || creator.length === 0) {
            return res.status(404).json({
                status: false,
                body: "Creator not found"
            });
        }

        const creatorName = creator[0].name;
        const creatorRole = creator[0].role;

        if (!creatorName || !creatorRole) {
            return res.status(404).json({
                status: false,
                body: "Invalid creator data"
            });
        }

        if (creatorRole === "admin" || creatorRole === "subadmin") {
            return res.status(403).json({
                status: false,
                body: "Admin/Subadmin is restricted to create blog from this API"
            });
        }

        const value = [
            title,
            image,
            description,
            creator_id,
            creatorName,
            creatorRole,
            false   // is_verified: for user it's always false initially
        ];

        const query = `
      INSERT INTO blog (title, image, description, creator_id, creator_name, creator_role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await db.query(query, value);

        return res.json({
            status: true,
            body: "Blog uploaded successfully"
        });

    } catch (e) {
        return res.status(500).json({
            status: false,
            body: e.message
        });
    }
};
