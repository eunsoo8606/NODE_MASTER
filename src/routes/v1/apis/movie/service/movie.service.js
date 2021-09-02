const conn = require('../../../../../lib/connection');

module.exports={
    deleteMovie : (movieList)=>{
        return new Promise((resolve,reject)=>{
            var db = conn.init();
            db.beginTransaction();
            console.log("movieList : ", movieList);
            var result = '';
            movieList.forEach(function(item){

            })
            db.query(app.INSERT,params,function(err,results,fields){
                console.log("result :", results)
                if (err !== undefined && err !== null) {
                    console.log("init...",err)
                    db.rollback();
                    db.end();
                    res.send(errors.error(resMsg.BAD_REQUEST,'APP VALUE',params,'QUERY ERROR',err));
                    return false;
                }
                if(results.affectedRows === 0){
                    db.rollback();
                    db.end();
                    res.status(stCd.BAD_REQUEST).send(errors.error(resMsg.INSERT_FAILD,'APP VALUE','','INSERT Error','INSERT FAILAD..'));
                }
                db.commit();
                db.end();
                return resolve(results.affectedRows);
            });
        });
    }
}