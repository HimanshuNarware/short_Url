const jwt = require('jsonwebtoken');

/**
 * Optional JWT Auth Middleware
 * If a valid token is present, attaches req.user.
 * If no token or invalid token, continues without blocking — req.user stays undefined.
 */
const optionalAuth = (req, res, next) => {
    try {
        const token = req.cookies && req.cookies.crafturl_token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch (_) {
        // Invalid/expired token — just ignore it, allow public access
    }
    next();
};

module.exports = optionalAuth;
