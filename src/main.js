const express            = require('express');
const app                = express();
const session            = require('express-session');
const compression        = require('compression');
const flash              = require("connect-flash");
const routes             = require('./routes/index');


require('dotenv').config();
/** SSL 적용을 위해 greenlock-express module 사용 */

// require('greenlock-express').init({
//   packageRoot: __dirname,
//   configDir: './greenlock.d',
//   maintainerEmail: 'eunsoo8606@naver.com',
// }).serve(app);

/** Session 생성 */
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


app.use(express.static("public"));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(flash());

app.set("views",__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);


app.use('/',routes);


require('./www/server')(app);