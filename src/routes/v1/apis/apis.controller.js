const express           = require('express');
const router            = express.Router();
const movieRouter       = require('./movie/movieController');
const weatherRouter    = require('../weather/weatherController');

router.use('/movie',movieRouter);
router.use('/weather',weatherRouter);

module.exports = router;