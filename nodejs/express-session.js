var express = require('express');
var session = require('express-session');
var util = require('util');
var FileStore = require('session-file-store')(session);
var app = express();

var fileStoreOptions = {};
app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: "mycookiesession"
}));

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());
console.log("FileStore : ")

var authData = {
  email : 'eunsoo8606@gmail.com',
  password:'111111',
  nickname: 'kim-es'
}

passport.serializeUser(function(user, done) {
  console.log("serializeUser : ",user);
  done(null,user);
});

passport.deserializeUser(function(user, done) {
    console.log("deserializeUser : ",user);
    done(null,user);
});

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd',
      session : false,
      passReqToCallback: true
    },
    function(req,username, password, done) {
      console.log(req.session);
      if(username !== authData.email){
        console.log(1)
        return done(null, false, { message: 'Incorrect username.' });
      }
      if(password !== authData.password){
        console.log(2)
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, authData);
    }
  ));
  
  app.post('/auth/login_process',
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/' })
    );

app.get('/', function (req, res, next) {
    console.log(req.session);
    // if(req.session.num === undefined){
    //     req.session.num = 1;
    // }else{
    //     req.session.num = req.session.num +1;
    // }
  res.send(` <form id="loginForm" method="POST" action="/auth/login_process">
  <h1>Sign in</h1>
  <input type="email" name="email" placeholder="이메일" />
  <input type="password"name="pwd" placeholder="비밀번호" />
  <input type="submit" value="로그인" />
</form>`);
})

var server = app.listen(3000, function () {
})