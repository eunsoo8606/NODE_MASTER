const express = require('express');
const request =require('request');
const router  = express.Router();
const common  = require('../../../utils/commonIMT');



router.get('/libs/home', (req, res) => {
    let scope;
    console.log("init");
    if(req.query.scope !== undefined){
        scope         = req.query.scope;
        req.session.scope = scope;
    }
    let cookies       = common.util.getCookie(req);
    let value         = (cookies.acToken === undefined?{login:'N'}:{login:'Y'});
    res.render("librarys/weather/weather.ejs",value);
});

router.get("/", function(req,res){
    let curDate   = req.query.date;
    let hour      = req.query.hour;
    let x = Math.round(req.query.x);
    let y = Math.round(req.query.y);
    let url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
    let queryParams = '?' +'ServiceKey' + '='+'kmW4K3Z%2BWA5icVGEC8I9Ee%2FYCmGfiwEEp86YikuBidzVIOKDk82dztG1t%2FrIwm8OA7mfEYKFt%2Fn%2BKyGRbOrnfQ%3D%3D';
    console.log("init........")
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100');
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(curDate); 
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(hour+'30'); 
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(x); 
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(y);


    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
        if(error){
            console.log("ERROR :: "+error);
            res.send(error);
        }
        let value = JSON.parse(body).response.body;

        hour  = (parseInt(hour)+1).toString();
        if(hour.length == 1) hour  = "0"+hour;
        var arr = new Array();
        for(var i = 0; i < value.totalCount;i++){
            if(value.items.item[i].fcstTime == hour+"00"){
                arr.push(value.items.item[i]);
            }
        }
        res.send(arr);
    });
});


router.get('/locationGridXY', (req, res) => {
    var address = req.query.address;
    var cookies = common.util.getCookie(req);
    request({
        url:`${process.env.apiServerUrl}/v1/apis/weather/locationGrid`,
        method:'GET',
        headers:{
                'Cotent-Type':'application/json; charset=UTF-8',
                'Authorization':'Bearer ' + cookies.acToken},
        qs:{
            address:address
        },json:true
    },
    function (error, response, body) {
        if(error !== undefined && error !== null){ 
            console.log("error : ", error);
            res.status(401).send(error);
            res.end();
            return false;
        }
        res.status(200).json({'lat':body.lat,'lng':body.lng});
    });
});

module.exports = router;