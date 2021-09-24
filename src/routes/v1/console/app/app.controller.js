const common     = require('../../../../utils/commonIMT');
const express    = require('express');
const appVo      = require('./vo/app.vo').appVo;
const router     = express.Router();
const appService = require('./service/app.service');
const request    = require('request');
const path       = require('path');

require('dotenv').config();

router.get('/', (req, res) => {
      res.render("app/main.ejs",{login:'Y'});
});

router.get('/:id', (req, res) => {
  var param = req.params.id;
  var cookies = common.util.getCookie(req);

  var app;
  if(param === 'list'){
    app = appVo(cookies.acToken,process.env.localClientId,100,'asc');
    appService.appList(app).then((data)=>{
       res.status(data.detail.code).send(data.detail.value);
       res.end();
    });
  }else{
    res.render('app/detailApp.ejs',{depth:0,sub:0,app:param});
  }
});

router.delete('/:id',(req,res)=>{
  var param = req.params.id;
  var cookies = common.util.getCookie(req);
  var app;
  app = appVo(cookies.acToken,process.env.localClientId,'','');
  appService.deleteApp(app,param).then((data)=>{
    res.status(data.detail.code).send(data.detail.value);
    res.end();
  });
});


router.post("/",common.multer.single('app_img'),(req,res)=>{

    var cookies         = common.util.getCookie(req);
    var file            = req.file;
    var appName         = req.body.app_name;
    var enterpriseName  = req.body.enterprise_name;
    var filePath        = file.destination;
    var u = filePath.split(path.join('/'));
    var imgUri = req.headers.origin + common.util.customFileUri(u) + '/' + file.filename;

    request({
      url:`${process.env.apiServerUrl}/v1/console/app`,
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

router.get("/:id/info",(req,res)=>{
  var param   = req.params.id;
  var cookies = common.util.getCookie(req);
  console.log("param : ", param);
  request({
    url:`${process.env.apiServerUrl}/v1/console/app/info`,
    method:'GET',
    headers:{
            'Cotent-Type':'application/json; charset=UTF-8',
            'Authorization':'Bearer ' + cookies.acToken},
    qs:{
      appSeq:param,
    },json:true
  },
  function (error, response, body) {
    if(error !== undefined && error !== null){ 
      res.status(401).send(error);
      return false;
    }
    res.send(body);
  });
});

router.get("/:id/default",(req,res)=>{
  var param = req.params.id;
  var depth  = req.query.depth;
  var sub    = req.query.sub;

  res.render("app/default.ejs",{app:param,depth:depth,sub:sub});
  res.end();
})


router.put("/",common.multer.single('app_img'),(req,res)=>{

  var cookies          = common.util.getCookie(req);
  var file             = req.file;
  var appName          = req.body.app_name;
  var enterpriseName   = req.body.enterprise_name;
  var body;
  if(file !== undefined){
    var filePath         = file.destination;
    var u = filePath.split(path.join('/'));
    var origin_file_path = req.body.origin_file_path;
    var rename_file_name = req.body.rename_file_name;

    //파일삭제경로 셋팅.
    origin_file_path = origin_file_path.substring(req.headers.origin.length+1,origin_file_path.lastIndexOf("/"));
    //기존파일 삭제.
    common.deleteFs(process.env.deleteFilePath,origin_file_path,rename_file_name);
    //새로운 파일 이미지 경로.
    var imgUri = req.headers.origin + common.util.customFileUri(u) + '/' + file.filename;

    body = {
            enterpriseName:enterpriseName,
            appName:appName,
            filePath:imgUri,
            originalFileName:file.originalname,
            renameFileName:file.filename
           }
  }else
  {
    body = {
            enterpriseName:enterpriseName,
            appName:appName
           }
  }
  
  request({
    url:`${process.env.apiServerUrl}/v1/console/app`,
    method:'PUT',
    headers:{
             'Cotent-Type':'application/json; charset=UTF-8',
             'Authorization':'Bearer ' + cookies.acToken},
    body:body,
    json:true
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