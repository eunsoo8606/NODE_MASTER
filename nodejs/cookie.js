var http = require('http');
var cookie = require('cookie');
http.createServer((req,res)=>{
    var cookie2 = req.headers.cookie;
    var cookies = {};
    if(cookie2 !== undefined) cookies = cookie.parse(cookie2);
    console.log(cookies);
 
    res.writeHead(200,{
        "Set-Cookie":[
    `Permarnent=cookies; Max-Age=${60*60*24*30}`,'Secure=Secure; Secure'
    ,'httpOnly=httpOnly; httpOnly'
    ,'Path=Path; Path=/cookie'
    ,'Domain=Domain; Domain=o2.org']
    })
    res.end("Cookie!!");
}).listen(3000);

