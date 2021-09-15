const express       = require('express');
const router        = express.Router();
const apisRouter    = require("./apis/apisController");
const loginRouter   = require("./login/login.controller");
const tokenRouter   = require("./token/token.controller");
const userRouter    = require("./user/user.controller");
const blogRouter    = require("./blog/blog.controller");
const weatherRouter = require("./weather/weather.controller");
const depth         = require("../../../lib/depth").depth;

router.get("/", (req,res)=>{
    res.render("documents/main.ejs",depth(req.query.depth,req.query.sub));
});

router.use('/apis',apisRouter);
router.use("/login",loginRouter);
router.use("/token",tokenRouter);
router.use("/user",userRouter);
router.use("/blog",blogRouter);
router.use("/weather",weatherRouter);

module.exports = router;