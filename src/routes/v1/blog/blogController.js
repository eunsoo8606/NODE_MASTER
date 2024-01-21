const express = require('express');
const router  = express.Router();
const common  = require('../../../utils/commonIMT');
const path    = require('path');
const util    = require('../../../utils/util');
const fs      = require('fs');
const appRoot = require('app-root-path');
const request = require('request');
const bCount  = require('../../../middlewares/blogCount');


router.get('/', (req, res) => {
    var scope;
    console.log("req.query.scope : ", req.query.scope)
    if(req.query.scope !== undefined){
        scope         = req.query.scope;
        req.session.scope = scope;
    }
    var cookies       = common.util.getCookie(req);
    var value = (cookies.acToken === undefined?{login:'N'}:{login:'Y'});
    res.render("blog/blog.ejs",value);
});

router.get('/list', (req, res) => {
    console.log("blog controller init...");
    let cookies     = common.util.getCookie(req);
    let cpage       = req.query.cpage;
    let selectSize  = req.query.selectSize;
    let title       = req.query.title;
    let content     = req.query.content;
    let limit       = req.query.limit;
    let scope       = (req.session.scope ?? "paging");
    console.log("scope : ", scope)
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
        case 'detail': bCount.count(blogSeq); res.render("blog/detail.ejs",value); break;
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
    console.log("write init.....", cookies)


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
            }else if(body.error !== null && body.error !== undefined){
                res.status(401).send(body.error);
                res.end();
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
        console.log("data : ", body.data)
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


router.get("/detail/:id/comments",(req,res)=>{
    var blogSeq = req.params.id;
    var cookies = common.util.getCookie(req);

    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail/comments`,
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
            res.status(401);
            res.end();
            return false;
        }
        
        if(body === undefined){ 
            res.status(401);
            res.end();
            return false;
        }
        
        res.status(200).send(body.data);
      });
});
router.post("/detail/:id/comments",(req,res)=>{
    var blogSeq      = req.params.id;
    var cookies      = common.util.getCookie(req);
    var text         = req.body.text;
    var authSeq      = req.body.authSeq;
    var parentSeq    = req.body.parentSeq;
    var commentLevel = req.body.commentLevel;
    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail/comments`,
        method:'POST',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        body:{
          'blogSeq':blogSeq,
          'text':text,
          'authSeq':authSeq,
          'parentSeq':parentSeq,
          'commentLevel':commentLevel
        },
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

        if(body.error !== undefined){
            res.send(body.error);
            return false;
        }
        res.send(body.data.toString());
      });
});


router.delete("/detail/:id/comments",(req,res)=>{
    var blogSeq     = req.params.id;
    var cookies     = common.util.getCookie(req);
    var commentSeq  = req.body.commentSeq; 
    console.log("commentSeq ::: ", commentSeq)
    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail/comments`,
        method:'DELETE',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        qs:{
          'blogSeq':blogSeq,
          'commentSeq':commentSeq
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


router.put("/detail/:id/comments",(req,res)=>{
    var blogSeq     = req.params.id;
    var cookies     = common.util.getCookie(req);
    var commentSeq  = req.body.commentSeq;
    var text        = req.body.conts;

    request({
        url:`${process.env.apiServerUrl}/v1/blog/detail/comments`,
        method:'PUT',
        headers:{
                 'Cotent-Type':'application/json; charset=UTF-8',
                 'Authorization':'Bearer ' + cookies.acToken},
        body:{
          'blogSeq':blogSeq,
          'commentSeq':commentSeq,
          'text':text
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
module.exports = router;