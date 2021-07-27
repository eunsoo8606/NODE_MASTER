const crypto = require('crypto');
const Crypto = require('crypto-js');
const dotenv = require('dotenv').config;
module.exports ={
    md5_Base64:(pwd)=>{
        var encode = crypto.createHash('md5').update(pwd).digest('base64');
        encode = encode.replace('+','=');
        return encode;
    }, //client_id
    md5_hex:(pwd)=>{return crypto.createHash('md5').update(pwd).digest('hex');}, //secretKey
    sha256_base64:(pwd)=>{return crypto.createHash('sha256').update(pwd).digest('base64');},
    sha256_hex:(pwd)=>{return crypto.createHash('sha256').update(pwd).digest('hex');},
    sha512_base64:(pwd)=>{return crypto.createHash('sha512').update(pwd).digest('base64');},
    sha512_hex:(pwd)=>{return crypto.createHash('sha512').update(pwd).digest('hex');},
    encrypt:(data)=>{return Crypto.AES.encrypt(data,process.env.secretKey).toString();},
    decrypt:(data)=>{return Crypto.AES.decrypt(data,process.env.secretKey).toString(Crypto.enc.Utf8);}
}
