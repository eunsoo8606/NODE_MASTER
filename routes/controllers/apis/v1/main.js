var express = require('express');
var fs = require('fs');
var router = express.Router();
const appRouter = require('./app/app.controller');
const userRouter = require('./user/userController');
router.use("/console/app",appRouter);
router.use("/user",userRouter);
module.exports = router;