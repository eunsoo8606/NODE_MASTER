const express = require("express");
const router  = express.Router();
const mailer = require('../../../lib/mail');


router.post('/', (req, res) => {
    var { email, company, subject ,message}  = req.body;
    let emailParam = {
      toEmail: email,     // 수신할 이메일
      subject: "["+ company +"] "  + subject,   // 메일 제목
      html: "회사 이메일 : " + email +"<br/> 내용 : " + message               // 메일 내용
    };
    mailer.sendGmail(emailParam);
  
    res.status(200).send("발송 완료!");
  });


  module.exports = router;