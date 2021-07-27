const request = require('request');
var express = require("express");
var router = express.Router();
var encrypto = require('../lib/hashFnc');
const connection = require('../lib/connection');
const dotenv = require('dotenv').config();
const cookie = require('cookie');

module.exports = (passport) =>{
router.post("/register_process",(req,response)=>{

  var email = req.body.email;
  var password = req.body.pwd;
  var nickname = req.body.nickname;
  console.log("email : " + email, ", pwd : " + password+ ", nickname : " + nickname);

      password = encrypto.sha256_base64(password);
      connection.connect();

      var testQuery = "INSERT INTO `MEMBER` (`EMAIL`,`PWD`,`NICK_NAME`,`MEMBER_GROUP`) VALUES ('" + email + "','" + password + "','"+ nickname +"','100');";
       
      connection.query(testQuery, function (err, results, fields) { // testQuery 실행
          if (err) {
              console.log("ERROR LOG : "+err);
          }
          console.log("result ::" + JSON.stringify(results));

        });
        testQuery = "SELECT * FROM MEMBER;";
        connection.query(testQuery, function (err, results, fields) { // testQuery 실행
          if (err) {
              console.log("ERROR LOG : "+err);
          }
          console.log("result ::" + JSON.stringify(results));
        });
        connection.end();
        response.redirect('/');


    });
    router.post('/login_process',
                  function(req,res){
                          var email = req.body.email;
                          var pwd = req.body.pwd;
                          var redirect_uri = 'http://localhost:3000/auth/login_callback';
                          var client_id = process.env.localClientId;
                      var jsonDataObj = {'email':email,'pwd':pwd,'client_id':client_id,'redirect_uri':redirect_uri}
                   var url = `http://localhost:8888/v1/login/login_process`;
                      request({
                          url: url,
                          method: 'POST',
                          body:jsonDataObj,
                          json:true
                      }, function (error, response, body) {
                            if(error) console.log("error : ", error);
                            console.log("body : ", body)
       
                        });
            });

    router.get('/logout_process',(req,res)=>{
        var cookies = {};
        cookies = cookie.parse(req.headers.cookie);
      console.log("init...", cookies)
    

        // request({
        //   url: 'http://localhost:8888/v1/user/logout',
        //   method: 'POST',
        //   headers:{
        //     'Authorization':'Bearer '+ cookies.acToken
        //   },
        //   body:{userSeq:cookies.id},
        //   json:true
        //  }, function (error, response, body) {
        //     console.log("body : ", body)
        // });

    });
    
                  
    return router;
}
  




// router.get("/create",(req,response)=>{
//   if(!status.checkOrder(req,response)){
//     response.end("login Required:!");
//     return false;
//   }
//     var title = 'WEB - create';
//     var list = template.list(req.list);
//     var html = template.HTML(title, list, `
//       <form action="/topic/create_process" method="post">
//         <p><input type="text" name="title" placeholder="title"></p>
//         <p>
//           <textarea name="description" placeholder="description"></textarea>
//         </p>
//         <p>
//           <input type="submit">
//         </p>
//       </form>
//     `, '',status.authStatusUIs(req,response));
//     response.send(html);
//   });
  
//   router.post("/create_process",(req,response)=>{
//     if(!status.checkOrder(req,response)){
//       response.end("login Required:!");
//       return false;
//     }
//     var title = req.body.title;
//     var description = req.body.description;
//     fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//     response.redirect(`/topic/${title}`);
//     });
  
//   });
  
//   router.post("/delete_process",(request,response) =>{
//     if(!status.checkOrder(req,response)){
//       response.end("login Required:!");
//       return false;
//     }   
//     var id = request.body.id;
//     fs.unlink(`data/${id}`, function(error){
//       response.redirect(`/`);
//     })
  
//   });
  
//   router.get('/:pageId', (req, response,next) => {
//         console.log("pageId init...")
//       var filteredId = path.parse(req.params.pageId).base;
//       fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
//           if(!err){
//           var title = req.params.pageId;
//           var sanitizedTitle = sanitizeHtml(title);
//           var sanitizedDescription = sanitizeHtml(description, {
//             allowedTags:['h1']
//           });
//           var list = template.list(req.list);
//           var html = template.HTML(sanitizedTitle, list,
//             `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
//             ` <a href="/topic/create">create</a>
//               <a href="/topic/update/${sanitizedTitle}">update</a>
//               <form action="/topic/delete_process" method="post">
//                 <input type="hidden" name="id" value="${sanitizedTitle}">
//                 <input type="submit" value="delete">
//               </form>`,status.authStatusUIs(req,response)
//           );
//           response.send(html);
//         }else{
//           next(err);
//         }
//       });
//   });
//   router.post("/update_process",(req,response)=>{
//     if(!status.checkOrder(req,response)){
//       response.end("login Required:!");
//       return false;
//     }
//     var id = req.body.id;
//     var title = req.body.title;
//     var description = req.body.description;
//     fs.rename(`data/${id}`, `data/${title}`, function(error){
//       fs.writeFile(`data/${title}`, description, 'utf8', function(err){
//         response.redirect(`/topic/${title}`);
//       })
//     });
  
//   });
  
  
//   router.get("/update/:pageId",(req,response)=>{
//     if(!status.checkOrder(req,response)){
//       response.end("login Required:!");
//       return false;
//     }
//           var filteredId = path.parse(req.params.pageId).base;
//           fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
//             var title = req.params.pageId;
//             var list = template.list(req.list);
//             var html = template.HTML(title, list,
//               `<form action="/topic/update_process" method="post">
//                 <input type="hidden" name="id" value="${title}">
//                 <p><input type="text" name="title" placeholder="title" value="${title}"></p>
//                 <p>
//                   <textarea name="description" placeholder="description">${description}</textarea>
//                 </p>
//                 <p>
//                   <input type="submit">
//                 </p>
//               </form>
//               `,
//               `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,status.authStatusUIs(req,response)
//             );
//             response.send(html);
//           });
//   });

