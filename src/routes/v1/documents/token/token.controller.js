const express     = require('express');
const router      = express.Router();
const depth       = require("../../../../lib/depth").depth;

router.get("/token",(req,res)=>{
    res.render("documents/token/getToken.ejs",depth(req.query.depth,req.query.sub));
});

router.get("/reToken",(req,res)=>{
    res.render("documents/token/getRefleshToken.ejs",depth(req.query.depth,req.query.sub));
});

module.exports = router;
