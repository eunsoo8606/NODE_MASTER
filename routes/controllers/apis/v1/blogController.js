var express = require('express');
var fs = require('fs');
var router = express.Router();



router.get('/moveBlog', (req, res) => {
    res.render("blog/blog.ejs");
    
  });


  module.exports = router;