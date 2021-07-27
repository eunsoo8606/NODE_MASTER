var express = require('express');
var fs = require('fs');
var router = express.Router();



router.get('/', (req, res) => {
    console.log("blog : ",req.session)
    res.render("apis/main.ejs");
  });


  module.exports = router;