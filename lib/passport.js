const crypto = require('crypto');
const bcrypt = require("bcrypt");

const passportConfig = { usernameField: 'email', passwordField: 'pwd' };
const dotenv = require('dotenv').config;
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
var store = require('store');
const conn = require('./connection');
var encrypto = require('../lib/hashFnc');
var authUtil = require('../public/common/util');





module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
  // app.get("/auth/logout_process",(req,response)=>{
  //   console.log("logout_process init...");
  //   req.logout();
  //   req.session.destroy(function(err){
  //     response.redirect("/");
  //   });
  // });

 

    passport.serializeUser(async function(user, done) {
        
        done(null,user);
      });
      
      passport.deserializeUser(async function(user, done) {
         var query = 'SELECT * FROM MEMBER WHERE MEMBER_SEQ ="' + user.MEMBER_SEQ + '"';
          conn.query(query, function (err, results, fields) { // testQuery 실행
           if (err || !results) return done(err,results);
           user = results[0];  
           return done(null, user);
          });  
      });
      

  


        passport.use(new GoogleStrategy({
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret:process.env.GOOGLE_SECRET,
          callbackURL: process.env.GOOGLE_REDIRECT_URI
        },
        function(accessToken, refreshToken, profile, done) {
         var email = profile.emails[0].value;
         var google_id = profile.id;
         var nickname = profile.displayName;
         var query = 'SELECT * FROM MEMBER WHERE EMAIL ="' + email + '"';
         var user;
         conn.query(query, function (err, results, fields) { 
              if (err) console.log("ERROR LOG : "+err);
                    user = results[0];
                  
                    if(user === undefined){

                      query = "INSERT INTO `MEMBER` (`EMAIL`,`NICK_NAME`,`MEMBER_GROUP`,GOOGLE_ID) VALUES ('" + email + "','" + nickname + "','100','" + google_id + "');";
                      conn.query(query, function (err, results, fields) { 
                        if (err) console.log("ERROR LOG : "+err);
                         if(results.affectedRows == "1"){

                            query = 'SELECT * FROM MEMBER WHERE GOOGLE_ID ="' + google_id + '"';
                            
                            conn.query(query, function (err, results, fields) { 
                              if (err) console.log("ERROR LOG : "+err);
                              conn.end();
                              done(null, user);
                            });

                          }
                      });
                    }else{

                      query = "UPDATE `MEMBER` SET GOOGLE_ID = '" + google_id + "' WHERE MEMBER_SEQ = '" + user.MEMBER_SEQ + "'";

                      conn.query(query, function (err, results, fields) { 
                        if (err) console.log("ERROR LOG : "+err);
                        done(null, user);
                      });
                      conn.end();
                    }      
                  });
                }
      ));

      app.get('/auth/google',
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email','profile'] })); 

      app.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        console.log("callback Success init!");
        user = req.session.passport.user;
        res.cookie('token',user.jwt,{expires: new Date(Date.now()+900000),httpOnly:true});
        res.redirect('/main');

      });


    //   passport.use(new FacebookStrategy({
    //     clientID: FACEBOOK_APP_ID,
    //     clientSecret: FACEBOOK_APP_SECRET,
    //     callbackURL: "http://localhost:3000/auth/facebook/callback"
    //   },
    //   function(accessToken, refreshToken, profile, done) {
    //     console.log("faceBook! : ",accessToken, refreshToken, profile, done);
    //   }
    // ));

    // app.get('/auth/facebook',
    //     passport.authenticate('facebook'));

    // app.get('/auth/facebook/callback',
    //   passport.authenticate('facebook', { failureRedirect: '/' }),
    //   function(req, res) {
    //     // Successful authentication, redirect home.
    //     res.redirect('/main');
    //   });

    passport.use('kakao', new KakaoStrategy({
      clientID: process.env.KAKAO_REST_API_KEY,
      callbackURL: process.env.KAKAO_REDIRECT_URI,     // 위에서 설정한 Redirect URI
    }, async (accessToken, refreshToken, profile, done) => {
      console.log("kakao Profile :::: ",profile, ", accessToken :: ", accessToken);
      var kakaoId = profile.id;
      var nickname = profile.displayName;
      var email = JSON.parse(profile._raw).kakao_account.email;

      var query = 'SELECT * FROM MEMBER WHERE EMAIL ="' + email + '"';
         var user;
         conn.query(query, function (err, results, fields) { 
          if (err) console.log("ERROR LOG : "+err);
              user = results[0];
              
              if(user === undefined){
                query = "INSERT INTO `MEMBER` (`EMAIL`,`NICK_NAME`,`MEMBER_GROUP`,KAKAO_ID) VALUES ('" + email + "','" + nickname + "','100','" + kakaoId + "');";
                conn.query(query, function (err, results, fields) { 
                  if (err) console.log("ERROR LOG : "+err);
                   if(results.affectedRows == "1"){
                      query = 'SELECT * FROM MEMBER WHERE KAKAO_ID ="' + kakaoId + '"';
                      conn.query(query, function (err, results, fields) { 
                        if (err) console.log("ERROR LOG : "+err);
                        conn.end();
                        done(null, user);
                      });
                    }
                });
              }else{
                query = "UPDATE `MEMBER` SET KAKAO_ID = '" + kakaoId + "' WHERE MEMBER_SEQ = '" + user.MEMBER_SEQ + "'";
                conn.query(query, function (err, results, fields) { 
                  if (err) console.log("ERROR LOG : "+err);
                  done(null, user);
                });
              }      
          });
    }));
    app.get('/auth/kakao', passport.authenticate('kakao',{
      failureFlash:true
    }));

    app.get('/auth/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/'}), 
    function(req, res,done){
        req.session.save(()=>{
          user = req.session.passport.user;
        /* user의 idx, email을 통해 토큰을 생성! */
        //  const jwtToken = await jwt.sign(user);
        // res.cookie('token',jwtToken,{expires: new Date(Date.now()+900000),httpOnly:true});
          
          res.redirect('/main');
        });
    });

    
        return passport;
}
