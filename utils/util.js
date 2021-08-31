var cookie = require('cookie');
const fs   = require('fs');

module.exports = {
    getCookie:(req)=>{
        var cookies = {};
        if(req.headers.cookie !== undefined) cookies = cookie.parse(req.headers.cookie);
        else cookies = '';

        return cookies;
    },
    makeFolder:(dir)=>{
        if(!fs.existsSync(dir)){
            console.log("init dir",dir);
            fs.mkdirSync(dir,{recursive:true});
        }
    },
    customFileUri:(dir)=>{
        var chk = 'N'
        var readLine = '';
        for(var i = 0; i < dir.length; i++){
            if(dir[i] === 'uploads'){
                for(var j = i; j < dir.length;j++){
                    readLine += '/' + dir[j]; 
                }
                break;
            }
        }
       return readLine;
    },
    responseSend:(result,msg,param,value,code)=>{
        var result = {};
        result.result = result;
        result.detail = {
            msg:msg,
            param:param,
            value:value,
            code:code
        }
        return result;
    }
}