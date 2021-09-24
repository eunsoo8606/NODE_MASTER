const util           = require('./util');
const multer         = require('./muter');
const TimesTemp      = require('../lib/TimesTemp');
const hashFnc        = require('../lib/hashFnc');
const token          = require('../lib/token');
const tokenVaildator = require('../lib/tokenVaildator');
const fs             = require('fs');
const path           = require('path');

const deleteFs = function(dirname,root,file_name){

    const filePath = path.join(dirname, root, file_name);
    console.log("filePath : ", filePath);
    fs.access(filePath, fs.constants.F_OK, (err) => { // A
        if (err) return console.log('삭제할 수 없는 파일입니다 : ', err);
      
    fs.unlink(filePath, (err) => err ?  
          console.log(err) : console.log(`${filePath} 를 정상적으로 삭제했습니다`));
    });
}




module.exports = {util,multer,TimesTemp,hashFnc,token,tokenVaildator,deleteFs}