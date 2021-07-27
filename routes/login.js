var express = require("express");
var router = express.Router();
var request=require('request');
const dotenv = require('dotenv').config;
const timeTemp = require('../lib/TimesTemp').timeTemp;
const hash = require('../lib/hashFnc');
router.get('/', (req, res) => {
  console.log("login_init....")
  var query = 'client_id=' + process.env.localClientId
            + '&redirect_uri='+process.env.redirect_uri;
    res.redirect('http://localhost:8888/oauth/authorize?'+query);
  });



router.get('/local/callback', (req, res) => {
  var authorizationCode = req.query.code;
  console.log("callback init...",authorizationCode)
  request({
          url: 'http://localhost:8888/oauth/token',
          method: 'POST',
          body:{authorizationCode:authorizationCode,client_id:process.env.localClientId},
          json:true
         }, function (error, response, body) {
           console.log("body : ", body)
          if(error){
              console.log("ERROR"+error);
              res.send(error);
              return false;
          }
          if(body === undefined){
             res.send(error);
             return false;
          }
          console.log("timeTemp(body.expires_in) : ", timeTemp(body.expires_in))
          var expiTime = hash.encrypt(timeTemp(body.expires_in));
          console.log("expiTime : ", expiTime);

          res.writeHead(302,{
            location:`/`,
            httpOnly:true,
            "Set-Cookie":[
                            `acToken=${body.accessToken}; Path=/`
                           ,`reToken=${body.refreshToken}; Path=/`
                           ,`expires_in=${expiTime}; Path=/`
                        ]
          });
          res.end();
      });
  });



























  
  // router.post("/login_process",(req,response)=>{
  //   var id = req.body.id;
  //   var password = req.body.password;
 
  //   if(id === "eunsoo8606@naver.com" && password === "111111"){
  //       console.log("init...")
  //       response.writeHead(302,{
  //           "Set-Cookie":[
  //               `id=${id}; Path=/`
  //               ,`password=${password}; Path=/`
  //               ,"nickname=kim-eun-soo; Path=/"
  //           ],
  //           location:`/main`
  //       });
  //       response.end();
  //   }else{
  //       response.end("Who?");
  //   }

  // });
  // router.get("/logout_process",(req,response)=>{
 
  //   console.log("logout_process init...");
  //   response.writeHead(302,{
  //       "Set-Cookie":[
  //           `id=; Max-Age=0;Path=/`
  //           ,`password=; Max-Age=0;Path=/`
  //           ,"nickname=; Max-Age=0;Path=/"
  //       ],
  //       location:`/`
  //   });
  //   response.end();
  
  // });



module.exports = router;