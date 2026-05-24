const router = require('express').Router();
const { success } = require('../Utils/ResponseWrapper');
const url = require('./Url');
const settings = require('./Settings');
const auth = require('./Auth');

router.get('/', (req, res) => {
    res.send(success(200, 'CraftURL API v2.0'));
});

router.use('/auth', auth);
router.use('/url', url);
router.use('/settings', settings);

module.exports = router;