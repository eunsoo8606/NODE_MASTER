const express           = require('express');
const router            = express.Router();
const cookie            = require('cookie');
const mainRouter        = require('./v1/main');

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


  module.exports = router;