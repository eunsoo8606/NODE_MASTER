const express = require('express');
const router  = express.Router();
const request = require('request');
const common  = require('../../../../utils/commonIMT');
router.get('/',(req,res)=>{
    var cookies         = common.util.getCookie(req);
    request({
        url:`${process.env.apiServerUrl}/v1/apis/movie`,
        method:'GET',
        headers:{
                'Cotent-Type':'application/json; charset=UTF-8',
                'Authorization':'Bearer ' + cookies.acToken},
        json:true
    },
    function (error, response, body) {
        if(error !== undefined && error !== null){ 
            console.log("error : ", error);
        res.status(401).send(error);
        res.end();
        return false;
        }
        if(body === undefined){ 
            res.send("401");
            return false;
        }
        res.send(body);
    });
});

module.exports = router;