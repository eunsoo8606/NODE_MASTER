const request = require('request');
const express = require('express');
const router  = express.Router();
const cookie  = require('../../../utils/util');

/*
 @Description : 유저 정보 조회 router
 @Parameter : memberSeq
 @RequestData : MemberInfo
 @ResponseData : MemberInfo
*/
router.get('/me',(req,res)=>{
    var cookies = cookie.getCookie(req);
    request({
      url:`http://localhost:8888/v1/user/me`,
      method:'GET',
      headers:{
               'Cotent-Type':'application/json; charset=UTF-8',
               'Authorization':'Bearer ' + cookies.acToken}
     ,json:true
    },
    function (error, response, body) {
     
      if(error !== undefined && error !== null){
        console.log("error init..")
           res.status(401).send(error);
           return false;
      }
      if(body.error !== ""){
        res.status(200).json(body);
        return false;
      }
        res.status(200).json(body.data);
    });
});

/*
 @Description : 유저 이메일 중복확인 router
 @Parameter : email
 @RequestData : email
 @ResponseData : string
*/
router.get('/userEmailCheck',(req,res)=>{
    console.log("req.params.email : " + req.query.email)
    getUser.userSelectEmailCount(req.query.email,res);
});


module.exports = router;