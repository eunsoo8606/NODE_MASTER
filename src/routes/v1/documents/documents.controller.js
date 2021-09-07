const express     = require('express');
const router      = express.Router();
const apisRouter  = require("./apis/apisController");
const loginRouter = require("./login/login.controller");
router.get("/", (req,res)=>{
    res.render("documents/main.ejs");
});

router.use('/apis',apisRouter);
router.use("/login",loginRouter);


module.exports = router;