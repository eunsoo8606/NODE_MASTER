module.exports ={
    depth:(depth,sub)=>{
        if(depth === undefined){
            depth = 0;
        }
        if(sub === undefined){
            sub = 0;
        }
        return {depth:depth,sub:sub};
    }
}