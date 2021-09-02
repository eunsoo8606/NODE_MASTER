const express    = require('express');
const router     = express.Router();
const appRouter  = require('./app/app.controller');

router.use('/app',appRouter);


module.exports = router;