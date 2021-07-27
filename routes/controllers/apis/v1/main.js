var express = require('express');
var fs = require('fs');
var router = express.Router();
const appRouter = require('./app/app.controller');

router.use("/console/app",appRouter);

  module.exports = router;