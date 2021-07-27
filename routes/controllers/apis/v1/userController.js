const express = require('express');
const router = express.Router();



/*
 @Description : 유저 정보 조회 router
 @Parameter : memberSeq
 @RequestData : MemberInfo
 @ResponseData : MemberInfo
*/
// router.get('/userSelectOne',(req,res)=>{
//     var member = getUser.userSelectOne(req.body.memberSeq);
//     res.send(JSON.parse(member));
// });

/*
 @Description : 유저 이메일 중복확인 router
 @Parameter : email
 @RequestData : email
 @ResponseData : string
*/
router.get('/userEmailCheck',(req,res)=>{
    console.log("req.params.email : " + req.query.email)
    getUser.userSelectEmailCount(req.query.email,res);
});


module.exports = router;