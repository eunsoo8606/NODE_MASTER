const express = require('express');
const router  = express.Router();



router.get('/', (req, res) => {
    res.render("apis/main.ejs");
});


module.exports = router;