const express    = require('express');
const router     = express.Router();
const apisRouter = require("./apis/apisController");

router.get("/", (req,res)=>{

});

router.use('/apis',apisRouter);



module.exports = router;