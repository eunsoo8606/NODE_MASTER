const request = require('request');


module.exports={
    count:(blogSeq)=>{
        try{
        request({
            url:`${process.env.apiServerUrl}/v1/blog/count`,
            method:'POST',
            headers:{
                     'Cotent-Type':'application/json; charset=UTF-8'},
            body:{
              'blogSeq':blogSeq
            },json:true
          },
          function (error, response, body) {
            console.log("data : ", body)
            if(error !== undefined && error !== null){ 
                console.log("blog count faild...");
            }
            
            if(body === undefined){ 
                console.log("blog count faild...");
            }
            console.log("count success : ", body);
          });
        }catch(err){
            console.log("count ERR : ", err);
        }
    }
}