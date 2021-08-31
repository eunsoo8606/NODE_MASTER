module.exports={
    appVo:(acToken,client_id,limit,order)=>{
        var app = {};
        app.acToken = acToken;
        app.client_id = client_id;
        app.limit = limit;
        app.order = order;
        return app;
    }
}