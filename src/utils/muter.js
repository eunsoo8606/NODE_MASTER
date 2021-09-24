const multer = require('multer');
const moment = require('moment');
const appRoot = require('app-root-path');
const path	 = require('path');
const util	 = require('./util');
const year = moment().format("YYYY");
const month = moment().format("MM");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {  // 파일이 업로드될 경로 설정
		console.log(" destination init.. dir : ", path.join(__dirname,'/uploads/img/'+year+'/'+month));
		var root = appRoot+'/public/uploads/img/'+year.toString()+'/'+month.toString();
		util.makeFolder(path.join(root));
		cb(null, path.join(root));
	},
	filename: (req, file, cb) => {	// timestamp를 이용해 새로운 파일명 설정
		let newFileName = new Date().valueOf() + path.extname(file.originalname);

		cb(null, newFileName)
	},
})
const upload = multer({ storage: storage })

module.exports = upload;