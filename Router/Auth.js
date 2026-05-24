const router = require('express').Router();
const {
    registerController,
    loginController,
    guestLoginController,
    logoutController,
    getMeController,
    getPlanController,
    upgradePlanController
} = require('../Controller/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/guest', guestLoginController);
router.post('/logout', logoutController);

// Protected routes
router.get('/me', authMiddleware, getMeController);
router.get('/plan', authMiddleware, getPlanController);
router.post('/plan/upgrade', authMiddleware, upgradePlanController);

module.exports = router;
