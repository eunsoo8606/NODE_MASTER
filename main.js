const dotenv = require('dotenv');
const express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var indexRouter = require("./routes/index");
var userRouter = require("./routes/controllers/apis/v1/userController");
var movieRouter = require("./routes/controllers/apis/v1/movieController");
var weatherRouter = require("./routes/controllers/apis/v1/weatherController");
var blogRouter = require("./routes/controllers/apis/v1/blogController");
var apiRouter = require("./routes/controllers/apis/v1/apisController");
var mainRouter = require("./routes/controllers/apis/v1/main");
var loginRouter = require('./routes/login');
var tokenTimeVaildator = require('./lib/tokenVaildator').checkTokenTime;
const app = express();
const session = require('express-session');
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:'secret code.',
  cookie:{
    secure:false,
    maxAge:null,
    httpOnly:true
  }
}));
var flash = require("connect-flash");
dotenv.config();
var port = process.env.PORT;


app.use(express.static("public"));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(flash());
app.set("views",__dirname + '/views');
app.set('view engine', 'ejs'); 
app.engine('ejs', require('ejs').renderFile);


var passport = require("./lib/passport")(app);
var authRouter = require("./routes/auth.js")(passport);
app.use('/auth',authRouter);
app.use('/',indexRouter);
app.use('/movie',tokenTimeVaildator,movieRouter);
app.use('/user',userRouter);
app.use('/weather',weatherRouter);
app.use('/blog',blogRouter);
app.use('/v1/documents/apis',apiRouter);
app.use('/v1',mainRouter);
app.use('/login',loginRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

