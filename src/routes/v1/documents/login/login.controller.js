const express     = require('express');
const router      = express.Router();

router.get("/", (req,res)=>{
    res.render("documents/login/login.ejs");
});

module.exports = router;