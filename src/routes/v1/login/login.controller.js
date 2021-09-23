const common  = require('../../../utils/commonIMT');
const request = require('request');
const express = require("express");
const router  = express.Router();
const cookie            = require('cookie');


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
          body:{code:authorizationCode,client_id:process.env.localClientId},
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

  router.get('/logout', (req, res) => {
    console.log("login_init....", process.env.redirect_uri_out)
    var cookies     = common.util.getCookie(req);
      request({
        url:`${process.env.apiServerUrl}/oauth/logout`,
        method:'GET',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{
          client_id:process.env.localClientId,
          redirect_uri:process.env.redirect_uri_out,
          local:process.env.masterKey
        },json:true,
        timeout: 500,
        followRedirect :true,
        maxRedirects :10
      },
      function (error, response, body) {
        res.clearCookie("reToken",{path:'/'});
        res.clearCookie("acToken",{path:'/'});
        res.clearCookie("expires_in",{path:'/'});
        res.clearCookie("continue",{path:'/'});
        res.clearCookie("re_lo",{path:'/'});
        res.redirect("/")
      }
      );
  
    });

    router.get('/logout/callback',(req,res)=>{
      var resultCode = req.query.resultCode;
      var error_msg  = req.query.error_msg;
      console.log("callback init...", resultCode);
      if(parseInt(resultCode) > 0){
        res.end();
      }else{
        res.render('common/error/error.ejs',{state:statusCode,description:error_msg});
      }
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