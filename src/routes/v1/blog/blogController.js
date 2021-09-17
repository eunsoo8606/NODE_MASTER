const express = require('express');
const router  = express.Router();
const common  = require('../../../utils/commonIMT');
const path    = require('path');
const util    = require('../../../utils/util');
const fs      = require('fs');
const appRoot = require('app-root-path');
const request = require('request');


router.get('/', (req, res) => {
    var scope         = req.query.scope;
    req.session.scope = scope;
    var cookies       = common.util.getCookie(req);
    var value         = (cookies.acToken === undefined?{login:'N'}:{login:'Y'});
    res.render("blog/blog.ejs",value);
});

router.get('/list', (req, res) => {
    console.log("blog controller init...");
    var cookies     = common.util.getCookie(req);
    var cpage       = req.query.cpage;
    var selectSize  = req.query.selectSize;
    var title       = req.query.title;
    var content     = req.query.content;
    var limit       = req.query.limit;
    var scope       = req.session.scope;

    request({
        url:`${process.env.apiServerUrl}/v1/blog/list`,
        method:'GET',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{
          limit:limit,
          cpage:cpage,
          selectSize:selectSize,
          title:title,
          content:content,
          order:'desc',
          scope:scope
        },json:true
      },
      function (error, response, body) {
        if(error !== undefined && error !== null){ 
            res.send("401");
            return false;
        }
        if(body === undefined){ 
            res.send("401");
            return false;
        }
        res.send({data:body.data,etc:body.etc});
      });
});

router.get('/detail/:id',(req,res)=>{
    var blogSeq  = req.params.id;
    var cookies  = common.util.getCookie(req);
    var category = Buffer.from(req.query.category, "base64").toString('utf8');
    var scope       = req.session.scope;
    var value   = (cookies.acToken === undefined?{blogSeq:blogSeq,login:'N',scope:scope}:{blogSeq:blogSeq,login:'Y',scope:scope});
    switch(category){
        case 'detail':res.render("blog/detail.ejs",value); break;
        case 'update':res.render("blog/update.ejs",value); break;
    }
});

router.get("/write",(req,res)=>{
    var cookies  = common.util.getCookie(req);
    if(cookies.acToken === undefined){
        res.render("common/error/error.ejs",{state:403,'description':'로그인 후 이용 가능한 서비스 입니다.'});
        return false;
    }
    var value = (cookies.acToken === undefined?{login:'N'}:{login:'Y'});
    res.render("blog/write.ejs",value);
});

router.post('/write',(req, res) => {
    var cookies         = common.util.getCookie(req);
    var title           = req.body.title;
    var content         = req.body.content;
    var mainImg         = req.body.mainImg;
    var category        = req.body.category;
    request({
            url:`${process.env.apiServerUrl}/v1/blog/write`,
            method:'POST',
            headers:{
                    'Cotent-Type':'application/json; charset=UTF-8',
                    'Authorization':'Bearer ' + cookies.acToken},
            body:{
            title:title,
            content:content,
            mainImg:mainImg,
            category:category
            },json:true
        },
        function (error, response, body) {
            if(error !== undefined && error !== null){ 
                console.log("error : ", error);
            res.status(401).send(error);
            res.end();
            return false;
            }
            res.send("200");
        });
    });

router.post('/upload', common.multer.single('file'),(req, res) => {
    var file     = req.file;
    var filePath = file.destination;
    var u        = filePath.split(path.join('/'));
    var imgUri   = req.headers.origin + common.util.customFileUri(u) + '/' + file.filename;
    res.send(imgUri);
});

router.get("/detail/:id/selectOne",(req,res)=>{
    var blogSeq = req.params.id;
    var cookies = common.util.getCookie(req);
    
    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail`,
        method:'GET',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{
          'blogSeq':blogSeq
        },json:true
      },
      function (error, response, body) {
        if(error !== undefined && error !== null){ 
            res.send("401");
            return false;
        }
        
        if(body === undefined){ 
            res.send("401");
            return false;
        }

        res.send(body.data);
      });
});

router.delete("/detail/:id",(req,res)=>{
    var blogSeq = req.params.id;
    var cookies = common.util.getCookie(req);
    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail`,
        method:'DELETE',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{
          'blogSeq':blogSeq
        },json:true
      },
      function (error, response, body) {
        if(error !== undefined && error !== null){ 
            res.send("401");
            return false;
        }
        if(body === undefined){ 
            res.send("401");
            return false;
        }
        res.status(201).send({data:body.data});
      });
});

router.put("/detail/:id",(req,res)=>{
    var blogSeq         = req.params.id;
    var cookies         = common.util.getCookie(req);
    var title           = req.body.title;
    var content         = req.body.content;
    var mainImg         = req.body.mainImg;
    request({
            url:`${process.env.apiServerUrl}/v1/blog/detail`,
            method:'PUT',
            headers:{
                    'Cotent-Type':'application/json; charset=UTF-8',
                    'Authorization':'Bearer ' + cookies.acToken},
            body:{
            title:title,
            content:content,
            mainImg:mainImg,
            blogSeq:blogSeq
            },json:true
        },
        function (error, response, body) {
            if(error !== undefined && error !== null){ 
                console.log("error : ", error);
                res.status(401).send(error);
                res.end();
                return false;
            }
            res.send("200");
        });
    });

    router.get("/top3",(req,res)=>{
    var cookies     = common.util.getCookie(req);
    
    request({
        url:`${process.env.apiServerUrl}/v1/blog/top3`,
        method:'GET',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{'scope':'list'},
        json:true
      },
      function (error, response, body) {
        if(error !== undefined && error !== null){ 
            res.send("401");
            return false;
        }
        if(body === undefined){ 
            res.send("401");
            return false;
        }
     
        res.send({data:body.data});
      });
    });



router.delete('/upload',(req, res) => {
    var delFile = req.body.delFile;

    if(delFile == "" || delFile == undefined) {
        res.send("file is not found..");
        return false;
    }

    fs.unlink(path.join(appRoot + "/src/public",delFile),(err)=>{ 
        if (err !== undefined || err != null){
            res.send("N");
            return false;
        }
        res.send("Y");
    });
});

module.exports = router;