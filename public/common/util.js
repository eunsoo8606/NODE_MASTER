const CODE = require('./statusCode').MSG;
const MSG = require('./responseMssage').TOKEN;
const authUtil ={
    checkToken: async (req,res,next)=>{
 
        var token = req.headers;
        console.log("token : " + token)
        // 토큰 없음
        if (!token)
            return res.status(400).send(CODE.BAD_REQUEST+":"+MSG.EMPTY_TOKEN);

        var accessToken = token;
        console.log("accessToken : ",accessToken);
        // decode
        const user = await jwt.verify(accessToken[1]);
        console.log("user : ", user);
        // 유효기간 만료
        if (user === 'TOKEN_EXPIRED')
            return res.json(CODE.UNAUTHORIZED, MSG.EXPIRED_TOKEN);
        // 유효하지 않는 토큰
        if (user === 'TOKEN_INVALID')
            return res.status(400).json(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN);
        if (user.memberSeq === undefined)
            return res.json(CODE.UNAUTHORIZED, MSG.INVALID_TOKEN);
            
        req.memberSeq = user.memberSeq;
        next();    
    }
}
module.exports = authUtil;
