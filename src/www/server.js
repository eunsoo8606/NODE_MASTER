const port = process.env.PORT;

module.exports = (app) =>{
  app.use(function(req, res, next) {
    res.render('common/error/error.ejs',{state:404,description:'Sorry cant find that!!'});
  });
  
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.render('common/error/error.ejs',{state:500,description:'Something broke!'});
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
  });
}