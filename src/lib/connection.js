const mysql = require('mysql');  // mysql 모듈 로드
const conn = { 
        host: '210.114.22.228',
        port: '3306',
        user: 'root',
        password: 'Tkfkd8606!',
        database: 'study_db'};



module.exports =  mysql.createConnection(conn);

