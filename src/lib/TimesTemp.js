module.exports={
    timeTemp:(sec)=>{
        var hour, min, sec; 
        min = sec / 60; 
        hour = min / 60; 
        sec = sec % 60; 
        min = min % 60;
        console.log("Before : %d시 %d분 %d초", parseInt(hour), parseInt(min), sec);
        var date = new Date();
        date.setHours(date.getHours() + parseInt(hour));
        date.setMinutes(date.getMinutes() + parseInt(min));
        console.log("After : %d시 %d분", date.getHours(),date.getMinutes());
        return dateFormat(date);
    },
    currentTime:(date)=>{
        return dateFormat(date);
    },
    tokenTimeOut:(date)=>{
        date.setMinutes(date.getMinutes() + 10);
        return dateFormat(date);
    }

}
//parameter : new Date();
function dateFormat(date){
        var year  = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        var hour = date.getHours().toString();
        var min = date.getMinutes().toString();
        if(month.length === 1) month="0"+month;
        if(day.length === 1) day="0"+day;
        if(hour.length === 1) hour="0"+hour;
        if(min.length === 1) min="0"+min;
        return  year + month +  day + hour + min;
}