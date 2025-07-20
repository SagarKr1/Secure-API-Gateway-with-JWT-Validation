const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

/**
 * Authentication + optional Role-based Authorization middleware.
 * Usage:
 *   app.get('/admin', authMiddleware(['admin']), handler)
 *   app.get('/any', authMiddleware(), handler) // just auth, no role check
 */
const authMiddleware = (allowedRoles = []) =>
    asyncHandler(async (req, res, next) => {
        let token;

        try {
            const authHeader = req.headers.authorization || '';

            console.log('[AuthMiddleware] Header:', authHeader);

            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];

                if (!token) {
                    return res.status(401).json({ error: 'Unauthorized: Token missing' });
                }

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Attach user to request
                req.user = decoded;

                console.log('[AuthMiddleware] Decoded user:', decoded);

                // If roles were passed → check if user's role is allowed
                if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                    return res.status(403).json({ error: 'Forbidden: Role not permitted' });
                }

                return next();
            }

            // If no Bearer header
            return res.status(401).json({ error: 'Unauthorized: No token provided' });

        } catch (error) {
            console.error('[AuthMiddleware] Error:', error.message);
            return res.status(401).json({ error: `Unauthorized: ${error.message}` });
        }
    });

module.exports = authMiddleware;
