const express            = require('express');
const bodyParser         = require('body-parser');
const compression        = require('compression');
const indexRouter        = require("./routes/index");
const movieRouter        = require("./routes/controllers/apis/v1/movieController");
const weatherRouter      = require("./routes/controllers/apis/v1/weatherController");
const blogRouter         = require("./routes/controllers/apis/v1/blogController");
const apiRouter          = require("./routes/controllers/apis/v1/apisController");
const mainRouter         = require("./routes/controllers/apis/v1/main");
const loginRouter        = require('./routes/login');
const tokenTimeVaildator = require('./lib/tokenVaildator').checkTokenTime;
const app                = express();
const session            = require('express-session');
require('dotenv').config();
require('greenlock-express').init({
  packageRoot: __dirname,
  configDir: './greenlock.d',
  maintainerEmail: 'eunsoo8606@naver.com',
}).serve(app);
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

