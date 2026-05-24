const jwt = require('jsonwebtoken');
const { error } = require('../Utils/ResponseWrapper');

/**
 * JWT Auth Middleware
 * Validates the JWT stored in the httpOnly cookie "crafturl_token"
 * Attaches decoded user payload to req.user
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies && req.cookies.crafturl_token;

        if (!token) {
            return res.status(401).send(error(401, 'Authentication required. Please log in.'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, plan, isGuest }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send(error(401, 'Session expired. Please log in again.'));
        }
        return res.status(401).send(error(401, 'Invalid session token. Please log in.'));
    }
};

module.exports = authMiddleware;
