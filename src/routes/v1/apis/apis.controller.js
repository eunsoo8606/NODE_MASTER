const express           = require('express');
const router            = express.Router();
const movieRouter       = require('./movie/movieController');
const weartherRouter    = require('./wearther/weatherController');

router.use('/movie',movieRouter);
router.use('/wearther',weartherRouter);

module.exports = router;