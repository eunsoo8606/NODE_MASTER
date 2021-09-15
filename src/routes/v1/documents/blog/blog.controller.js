const express     = require('express');
const router      = express.Router();
const depth       = require("../../../../lib/depth").depth;

router.get("/", (req,res)=>{
    var sub = req.query.sub;
    switch(sub){
        case '0' :res.render("documents/blog/blog1.ejs",depth(req.query.depth,req.query.sub));break;
        case '1' :res.render("documents/blog/blog2.ejs",depth(req.query.depth,req.query.sub));break;
        case '2' :res.render("documents/blog/blog3.ejs",depth(req.query.depth,req.query.sub));break;
        case '3' :res.render("documents/blog/blog4.ejs",depth(req.query.depth,req.query.sub));break;
    }
    
});



module.exports= router;