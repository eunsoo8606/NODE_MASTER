var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var status = require('../public/js/authStatus.js');

router.get("/create",(req,response)=>{
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '',status.authStatusUIs(req,response));
    response.send(html);
  });
  
  router.post("/create_process",(req,response)=>{
    if(!isOrner(req)) {
      response.end("login Required:!");
      return false;
    }

    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    response.redirect(`/topic/${title}`);
    });
  
  });
  
  router.post("/delete_process",(request,response) =>{ 
    if(!isOrner(request)) {
      response.end("login Required:!");
      return false;
    }
    var id = request.body.id;
    fs.unlink(`data/${id}`, function(error){
      response.redirect(`/`);
    })
  });
  
  router.get('/:pageId', (req, response,next) => {
        console.log("pageId init...")
      var filteredId = path.parse(req.params.pageId).base;
      fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
          if(!err){
          var title = req.params.pageId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          var list = template.list(req.list);
          var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/topic/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`,status.authStatusUIs(req,response)
          );
          response.send(html);
        }else{
          next(err);
        }
      });
  });
  router.post("/update_process",(req,response)=>{
    if(!isOrner(req)) {
      response.end("login Required:!");
      return false;
    }
    var id = req.body.id;
    var title = req.body.title;
    var description = req.body.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
      })
    });
  
  });
  
  
  router.get("/update/:pageId",(req,response)=>{

          var filteredId = path.parse(req.params.pageId).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = req.params.pageId;
            var list = template.list(req.list);
            var html = template.HTML(title, list,
              `<form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,status.authStatusUIs(req,response)
            );
            response.send(html);
          });
  });

  function isOrner(req){
    if(req.session.isOrner){
    return true;
    }
    else return false;
    
  }
  module.exports = router;