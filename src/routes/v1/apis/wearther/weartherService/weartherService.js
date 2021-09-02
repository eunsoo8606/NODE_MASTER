const connection = require('../../../../../lib/connection');


module.exports = {
    getLocationGridXY: (address)=>{
        return new Promise((resolve, reject)=>{
            console.log("address : ",address);
           var query = `SELECT *
                           FROM HANG_DONG_TMP
                          WHERE CONCAT(HANGDONG_GUNGU,HANGDONG_DONG) LIKE` + `"%` + address +`%"`;
            connection.query(query, function (err, results, fields) { // testQuery 실행
                if (err || !results) {
                    resolve("ERROR LOG : "+err);
                }
                resolve(results[0]);
            });
        });
    }
};