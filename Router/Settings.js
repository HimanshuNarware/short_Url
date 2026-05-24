const router = require('express').Router();
const {
    getProfileController,
    updateProfileController,
    getSystemSettingsController,
    updateSystemSettingsController,
    getApiKeysController,
    createApiKeyController,
    deleteApiKeyController
} = require('../Controller/SettingsController');

router.get('/profile', getProfileController);
router.put('/profile', updateProfileController);

router.get('/system', getSystemSettingsController);
router.put('/system', updateSystemSettingsController);

router.get('/keys', getApiKeysController);
router.post('/keys', createApiKeyController);
router.delete('/keys/:id', deleteApiKeyController);

module.exports = router;
    