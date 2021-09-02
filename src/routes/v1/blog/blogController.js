const express = require('express');
const router = express.Router();



router.get('/blog', (req, res) => {
    res.render("blog/blog.ejs");
});

router.get('/moveWriteBlog', (req, res) => {
    res.render("blog/blog.ejs");
});


  module.exports = router;