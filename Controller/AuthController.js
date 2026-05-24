const User = require('../Model/User');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { success, error } = require('../Utils/ResponseWrapper');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Register a new user
 * POST /api/auth/register
 */
const registerController = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send(error(400, 'Username and password are required.'));
        }
        if (password.length < 6) {
            return res.send(error(400, 'Password must be at least 6 characters.'));
        }

        const existing = await User.findOne({ username });
        if (existing) {
            return res.send(error(409, 'Username already taken. Please choose another.'));
        }

        const user = await User.create({ username, password });

        const token = jwt.sign(
            { id: user._id, username: user.username, plan: user.plan, isGuest: false },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('crafturl_token', token, COOKIE_OPTIONS);
        return res.send(success(200, {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            level: user.level,
            plan: user.plan,
            isGuest: false
        }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

/**
 * Login an existing user
 * POST /api/auth/login
 */
const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.send(error(400, 'Username and password are required.'));
        }

        const user = await User.findOne({ username, isGuest: false });
        if (!user) {
            return res.send(error(404, 'User not found. Please check your username.'));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.send(error(401, 'Incorrect password. Please try again.'));
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, plan: user.plan, isGuest: false },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('crafturl_token', token, COOKIE_OPTIONS);
        return res.send(success(200, {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            level: user.level,
            plan: user.plan,
            isGuest: false
        }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

/**
 * Guest login — creates a temporary guest account
 * POST /api/auth/guest
 */
const guestLoginController = async (req, res) => {
    try {
        const guestId = nanoid(6);
        const username = `guest_${guestId}`;
        const password = nanoid(16); // random non-guessable password

        const user = await User.create({
            username,
            password,
            avatar: '👤',
            level: 1,
            plan: 'free',
            isGuest: true
        });

        const token = jwt.sign(
            { id: user._id, username: user.username, plan: 'free', isGuest: true },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('crafturl_token', token, COOKIE_OPTIONS);
        return res.send(success(200, {
            id: user._id,
            username: user.username,
            avatar: '👤',
            level: 1,
            plan: 'free',
            isGuest: true
        }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

/**
 * Logout — clears the auth cookie
 * POST /api/auth/logout
 */
const logoutController = (req, res) => {
    res.clearCookie('crafturl_token');
    return res.send(success(200, 'Logged out successfully.'));
};

/**
 * Get current user from token (for session restore on page load)
 * GET /api/auth/me
 */
const getMeController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.send(error(404, 'User not found.'));
        }
        return res.send(success(200, {
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            level: user.level,
            plan: user.plan,
            isGuest: user.isGuest
        }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

/**
 * Get premium plan info (dummy data)
 * GET /api/auth/plan
 */
const getPlanController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const plans = {
            free: {
                name: 'Free',
                tier: 'CRAFTER',
                price: '$0/mo',
                urlLimit: 15,
                analyticsRetention: '7 days',
                customDomains: false,
                apiAccess: false,
                prioritySupport: false,
                features: [
                    'Up to 15 shortened URLs',
                    '7-day analytics retention',
                    'Basic click tracking',
                    'Community support'
                ]
            },
            premium: {
                name: 'Premium',
                tier: 'MASTER_CRAFTER',
                price: '$9.99/mo',
                urlLimit: 'Unlimited',
                analyticsRetention: '365 days',
                customDomains: true,
                apiAccess: true,
                prioritySupport: true,
                features: [
                    'Unlimited shortened URLs',
                    '365-day analytics retention',
                    'Advanced analytics & heatmaps',
                    'Custom domain support',
                    'API access with high rate limits',
                    'Priority support',
                    'Password-protected links',
                    'QR code generation'
                ]
            }
        };
        return res.send(success(200, {
            currentPlan: user ? user.plan : req.user.plan,
            plans
        }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

/**
 * Upgrade to premium (dummy)
 * POST /api/auth/plan/upgrade
 */
const upgradePlanController = async (req, res) => {
    try {
        if (req.user.isGuest) {
            return res.send(error(403, 'Guests cannot upgrade. Please create a full account.'));
        }
        // In real app: handle payment here
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { plan: 'premium' },
            { new: true }
        ).select('-password');

        // Reissue JWT with updated plan
        const token = jwt.sign(
            { id: user._id, username: user.username, plan: 'premium', isGuest: false },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('crafturl_token', token, COOKIE_OPTIONS);
        return res.send(success(200, { message: 'Upgraded to Premium!', plan: 'premium' }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

module.exports = {
    registerController,
    loginController,
    guestLoginController,
    logoutController,
    getMeController,
    getPlanController,
    upgradePlanController
};
