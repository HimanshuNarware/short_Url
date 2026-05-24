const { 
  getUrlShortnerController, 
  getRecentUrlsController, 
  deleteUrlController,
  getGlobalStatsController 
} = require('../Controller/UrlController');

const router = require('express').Router();
const middleware = require('../middleware/middleware');

router.post('/', middleware,  getUrlShortnerController);
router.get('/recent', getRecentUrlsController);
router.get('/stats', getGlobalStatsController);
router.delete('/:id', deleteUrlController);

module.exports = router;
