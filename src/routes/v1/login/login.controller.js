const common  = require('../../../utils/commonIMT');
const request = require('request');
const express = require("express");
const router  = express.Router();



require('dotenv').config();

router.get('/', (req, res) => {
  console.log("login_init....", process.env.masterKey)
  var query = 'client_id=' + process.env.localClientId
            + '&redirect_uri='+process.env.redirect_uri;
    res.redirect(`${process.env.apiServerUrl}/oauth/authorize?`+query + "&local=" + process.env.masterKey);
  });



router.get('/local/callback', (req, res) => {
  var authorizationCode = req.query.code;
  request({
          url: `${process.env.apiServerUrl}/oauth/token?local=`+process.env.masterKey,
          method: 'POST',
          body:{authorizationCode:authorizationCode,client_id:process.env.localClientId},
          json:true
         }, function (error, response, body) {
           console.log("body : ", body);

          if(error){
              console.log("ERROR"+error);
              res.send(error);
              return false;
          }

          if(body === undefined){
             res.send(error);
             return false;
          }
          console.log("body : ", body);
          var expiTime  = common.hashFnc.encrypt(common.TimesTemp.timeTemp(body.expires_in));
          var member_id = common.hashFnc.encrypt(String(body._json.id));

          res.writeHead(302,{
            location:`/`,
            httpOnly:true,
            "Set-Cookie":[
                            `acToken=${body.accessToken};  Path=/`
                           ,`reToken=${body.refreshToken}; Path=/`
                           ,`expires_in=${expiTime}; Path=/`
                           ,`lo_id=${member_id} Path=/`
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