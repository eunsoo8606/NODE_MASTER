var express = require('express');
var request=require('request');
var router = express.Router();
var weatherService = require('./weartherService/weartherService');

router.get("/weatherApi", function(req,res){
    var curDate = req.query.date;
    var hour = req.query.hour;
    var x = Math.round(req.query.x);
    var y = Math.round(req.query.y);
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
    var queryParams = '?' +'ServiceKey' + '='+'kmW4K3Z%2BWA5icVGEC8I9Ee%2FYCmGfiwEEp86YikuBidzVIOKDk82dztG1t%2FrIwm8OA7mfEYKFt%2Fn%2BKyGRbOrnfQ%3D%3D'; 
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
            console.log("ERROR"+error);
            res.send(error);
        }
        var value = JSON.parse(body).response.body;
        hour  = (parseInt(hour)+1).toString();
        if(hour.length == 1) hour  = "0"+hour;
        console.log("hour : ",hour);
        var arr = new Array();
        for(var i = 0; i < value.totalCount;i++){
            if(value.items.item[i].fcstTime == hour+"00"){
                arr.push(value.items.item[i]);
            }
        }
        res.send(arr);
    });
});


router.get('/locationGridXY', async (request, response) => {
    var address = request.query.address;
    weatherService.getLocationGridXY(address).then((data)=>{
        response.status(200).json({'lat':data.HANGDONG_LAT,'lng':data.HANGDONG_LNG});
    });
});

module.exports = router;