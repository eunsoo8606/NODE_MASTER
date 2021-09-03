const port = process.env.PORT;

module.exports = (app) =>{
  app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });
  
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at ${port}`);
  });
}