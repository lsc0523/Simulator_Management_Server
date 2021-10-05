
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadMiddleware = function (siteCd, procCd) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {     
           
            const siteFolderPath = path.join(process.env.PATH_PG_UPLOAD, process.env.PATH_SIMULATOR_REMOTE, siteCd);
            const procFolderPath = path.join(siteFolderPath, procCd);
                       
            if (!(fs.existsSync(siteFolderPath))) {
                fs.mkdirSync(siteFolderPath);
            };

            if (!(fs.existsSync(procFolderPath))) {
                fs.mkdirSync(procFolderPath);
            };

            cb(null, procFolderPath);
            
        },
        filename(req, file, cb) {                
            cb(null, file.originalname);            
        },
    });
    return multer({ storage })
}

module.exports = uploadMiddleware;
