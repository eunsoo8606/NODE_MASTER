var express = require('express');
var fs = require('fs');
var router = express.Router();
const cookie = require('cookie');

router.get('/', (request, response) => {
      var cookies = {};
      if(!request.headers.cookie)
      return response.render("index.ejs",{login:'N'}); 

      cookies = cookie.parse(request.headers.cookie);
      if(cookies.acToken === undefined || cookies.acToken === '')
      response.render("index.ejs",{login:'N'});
      else
      response.render("index.ejs",{login:'Y'}); 
      
  });

  router.get('/main', (request, response) => {
    var user;
    if(request.session.passport.user !== undefined) {
      user = request.session.passport.user;
    }else user = "";
    if(user !== ""){ 
      response.render("index.ejs",{name:user.nickname,token:user.jwt});
    }
    else response.render("index.ejs",{name:null});
    
  });


  module.exports = router;