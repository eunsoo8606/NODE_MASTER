
const dotenv  = require('dotenv').config;
const request = require('request');
module.exports = {
    renewalToken:(refreshToken)=>{
       return new Promise((resolve,reject) => {
        request({
            url: 'http://localhost:8888/oauth/token',
            method: 'POST',
            body:{ grant_type: 'refresh_token',
                   client_id : process.env.localClientId,
                   refreshToken:refreshToken
                 },
            json:true
           }, function (error, response, body) {
               if(error){
                return resolve(error);
               }
                return resolve(body);
          });
       })
    }
}