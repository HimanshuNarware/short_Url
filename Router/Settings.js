const router = require('express').Router();
const {
    getProfileController,
    updateProfileController,
    getSystemSettingsController,
    updateSystemSettingsController,
} = require('../Controller/SettingsController');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/profile', optionalAuth, getProfileController);
router.put('/profile', optionalAuth, updateProfileController);

router.get('/system', optionalAuth, getSystemSettingsController);
router.put('/system', optionalAuth, updateSystemSettingsController);

module.exports = router;