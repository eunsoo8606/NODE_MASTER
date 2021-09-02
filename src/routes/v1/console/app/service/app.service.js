const request = require('request');
const util    = require('../../../../../utils/util');

module.exports={
    appList:(app)=>{
        return new Promise((resolve,reject)=>{
            request({
                url:`http://localhost:8888/v1/console/app`,
                method:'GET',
                headers:{
                         'Cotent-Type':'application/json; charset=UTF-8',
                         'Authorization':'Bearer ' + app.acToken},
                qs:{
                  client_id:app.localClientId,
                  limit:app.limit,
                  order:app.order
                },json:true
              },
              function (error, response, body) {
                if(error !== undefined && error !== null){ 
                    resolve(util.responseSend(false,'app list get faild..','app',app,600));
                }

                   resolve(util.responseSend(true,'request success!','app',body.data,200));
              });
        });
    },
    appDetail:(app,appSeq)=>{
        console.log('appSeq : ', appSeq);
        return new Promise((resolve,reject)=>{
            request({
                url:`http://localhost:8888/v1/console/app/${appSeq}`,
                method:'GET',
                headers:{
                         'Cotent-Type':'application/json; charset=UTF-8',
                         'Authorization':'Bearer ' + app.acToken},
                qs:{
                  client_id:app.localClientId
                },
                json:true
              },
              function (error, response, body) {
                if(error !== undefined && error !== null){ 
                    resolve(util.responseSend(false,'app detail get faild..','app',app,401));
                }
                console.log("body :", body);
                resolve(util.responseSend(true,'request success!','app',body.data,200));
              });
        });
    },
    deleteApp:(app,appSeq)=>{
        return new Promise((resolve,reject)=>{
            request({
                url:`http://localhost:8888/v1/console/app/${appSeq}`,
                method:'DELETE',
                headers:{
                         'Cotent-Type':'application/json; charset=UTF-8',
                         'Authorization':'Bearer ' + app.acToken},
                qs:{
                  client_id:app.localClientId
                },
                json:true
              },
              function (error, response, body) {
                if(error !== undefined && error !== null){ 
                    resolve(util.responseSend(false,'app detail get faild..','app',app,401));
                }

                resolve(util.responseSend(true,'delete success!','app',body,200));
              });
        });
    }
}