const express    = require('express');
const router     = express.Router();
const appRouter  = require('./app/app.controller');
const checkTokenTime    = require('../../../lib/tokenVaildator');

router.use('/app',checkTokenTime.checkTokenTime,appRouter);


module.exports = router;