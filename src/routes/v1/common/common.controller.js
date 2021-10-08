const common     = require('../../../utils/commonIMT');
const express    = require('express');
const router     = express.Router();
const request    = require('request');

router.get("/nav",(req,res)=>{
    var cookies = common.util.getCookie(req);
    var login   = "Y";
    if(cookies.acToken === undefined) login = "N";
    res.send(login);
});



module.exports = router;
