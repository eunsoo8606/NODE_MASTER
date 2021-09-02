const express    = require('express');
const router     = express.Router();
const cookie     = require('cookie');
const mainRouter = require('./v1/main');


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

  router.use('/v1',mainRouter);

  // router.get('/main', (request, response) => {
  //   var user;
  //   if(request.session.passport.user !== undefined) {
  //     user = request.session.passport.user;
  //   }else user = "";
  //   if(user !== ""){ 
  //     response.render("index.ejs",{name:user.nickname,token:user.jwt});
  //   }
  //   else response.render("index.ejs",{name:null});
    
  // });


  module.exports = router;