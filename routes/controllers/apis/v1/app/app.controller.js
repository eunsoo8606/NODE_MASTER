const cookie  = require('../../../../../utils/util');
const express = require('express');
const fs      = require('fs');
const router  = express.Router();
const upload  = require('../../../../../utils/muter');
const hash    = require('../../../../../lib/hashFnc');
const util    = require('../../../../../utils/util');
const appVo   = require('./vo/app.vo').appVo;
const appService = require('./service/app.service');
const path    = require('path');
const request = require('request');
const { parse } = require('path');
require('dotenv').config();


router.get('/', (req, res) => {
      res.render("apis/app.ejs");
});

router.get('/:id', (req, res) => {
  var param = req.params.id;
  var cookies = cookie.getCookie(req);
  var app;
  if(param === 'list'){
    app = appVo(cookies.acToken,process.env.localClientId,100,'asc');
    appService.appList(app).then((data)=>{
       res.status(data.detail.code).send(data.detail.value);
       res.end();
    });
  }else{
    res.render('apis/detailApp.ejs');
  }
});

router.get('/:id/:category', (req, res) => {
  var param = req.params.id;
  var category = req.params.category;
  var cookies = cookie.getCookie(req);
  var app;

  if(category === 'info'){
    app = appVo(cookies.acToken,process.env.localClientId,'','');
    appService.appDetail(app,param).then((data)=>{
      res.status(data.detail.code).send(data.detail.value);
      res.end();
    });
  }
  if(category === 'login') {
    res.render('apis/detailAppLogin.ejs');
    res.end();
  }
});



router.delete('/:id',(req,res)=>{
  console.log("app delete init...")
  var param = req.params.id;
  var cookies = cookie.getCookie(req);
  var app;
  app = appVo(cookies.acToken,process.env.localClientId,'','');
  appService.deleteApp(app,param).then((data)=>{
    res.status(data.detail.code).send(data.detail.value);
    res.end();
  });
});


router.post("/",upload.single('app_img'),(req,res)=>{

    var cookies         = cookie.getCookie(req);
    var file            = req.file;
    var appName         = req.body.app_name;
    var enterpriseName  = req.body.enterprise_name;
    var filePath        = file.destination;
    var u = filePath.split(path.join('/'));
    var imgUri = req.headers.origin + util.customFileUri(u) + '/' + file.filename;

    request({
      url:`http://localhost:8888/v1/console/app`,
      method:'POST',
      headers:{
               'Cotent-Type':'application/json; charset=UTF-8',
               'Authorization':'Bearer ' + cookies.acToken},
      body:{
        enterpriseName:enterpriseName,
        appName:appName,
        filePath:imgUri,
        originalFileName:file.originalname,
        renameFileName:file.filename
      },json:true
    },
    function (error, response, body) {
      if(error !== undefined && error !== null){ 
        res.status(401).send(error);
        return false;
      }
      res.sendStatus(201);
      res.end();
    });
    
});


  module.exports = router;