const express     = require('express');
const router      = express.Router();
const depth       = require("../../../../lib/depth").depth;

router.get("/", (req,res)=>{
    res.render("documents/weather/weather.ejs",depth(req.query.depth,req.query.sub));
});


module.exports = router;