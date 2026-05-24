const {
  getUrlShortnerController,
  getRecentUrlsController,
  deleteUrlController,
  getGlobalStatsController
} = require('../Controller/UrlController');

const router = require('express').Router();
const geoMiddleware = require('../middleware/middleware');
const optionalAuth = require('../middleware/optionalAuth');

// All URL routes are public — optionalAuth attaches user if logged in
router.post('/', optionalAuth, geoMiddleware, getUrlShortnerController);
router.get('/recent', optionalAuth, getRecentUrlsController);
router.get('/stats', optionalAuth, getGlobalStatsController);
router.delete('/:id', optionalAuth, deleteUrlController);

module.exports = router;
