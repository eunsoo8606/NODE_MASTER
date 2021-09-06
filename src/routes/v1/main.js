const express           = require('express');
const router            = express.Router();
const mailRouter        = require("./mail/mail");
const userRouter        = require('./user/userController');
const blogRouter        = require("./blog/blogController");
const apisRouter        = require("./apis/apis.controller");
const loginRouter       = require("./login/login.controller");
const consoleRouter     = require('./console/console.controller');
const documentsRouter   = require("./documents/documents.controller");


router.use('/blog',blogRouter);
router.use("/user",userRouter);
router.use('/login',loginRouter);
router.use("/console",consoleRouter);
router.use('/documents',documentsRouter);
router.use('/apis',apisRouter);
router.use('/mail',mailRouter);
module.exports = router;