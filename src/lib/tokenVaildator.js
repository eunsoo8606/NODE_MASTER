const cookie = require('cookie');
const time = require('./TimesTemp');
const hash = require('./hashFnc');
const token = require('./token');
const setCookie = require('set-cookie-parser');
module.exports = {
    checkTokenTime:(req,res,next)=>{
        console.log("check Token init...");
        var cookies = {};
        //쿠키 없으면 로그인도 안된거라 그냥 pass
        if(req.headers.cookie === undefined) return next();
        else cookies = cookie.parse(req.headers.cookie);

        //엑세스 토큰 만료시간 없어도 pass
        if(cookies.expires_in === undefined) return next();

        //토큰 만료시간
        var expiTime     = parseInt(hash.decrypt(cookies.expires_in));
        //현재시각 + 10분 시간
        var tokenTimeOut = parseInt(time.tokenTimeOut(new Date()));

        console.log('expiTime : ', expiTime)
        //현재 시간이 만료시간 과 같거나 더 크다면 reflreshToken으로 재발급.
        if(expiTime === tokenTimeOut || expiTime <= tokenTimeOut){
           console.log("token refresh..");
           token.renewalToken(cookies.reToken).then((reToken)=>{
               console.log("(reToken.expires_in : ", reToken.expires_in)
                var expiTime = hash.encrypt(time.timeTemp(reToken.expires_in));
                res.clearCookie('acToken');
                res.clearCookie('expires_in');
                res.cookie('expires_in',expiTime,{Path:'/',HttpOnly:true});
                res.cookie('acToken',reToken.accessToken,{Path:'/',HttpOnly:true});
           });
        }
        next();
    }
}