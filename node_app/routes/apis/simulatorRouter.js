const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const simulatorController = require('../../controllers/simulatorController');
const uploadMiddleware = require('../../middlewares/uploadMiddleware');
const ifLogController = require('../../controllers/ifController');

const Client = require('ssh2-sftp-client');
   
const fs = require("fs"); 
const dayjs = require('dayjs');

const sftpConfig_OC = {
    host: process.env.SSH_OC_HOST,
    port: process.env.SSH_OC_PORT,
    username: process.env.SSH_OC_USERNAME,
    password: process.env.SSH_OC_PASSWORD
};

const sftpConfig_ESWA = {
    host: process.env.SSH_ESWA_HOST,
    port: process.env.SSH_ESWA_PORT,
    username: process.env.SSH_ESWA_USERNAME,
    password: process.env.SSH_ESWA_PASSWORD
};

const sftpConfig_ESNB = {
    host: process.env.SSH_ESNB_HOST,
    port: process.env.SSH_ESNB_PORT,
    username: process.env.SSH_ESNB_USERNAME,
    password: process.env.SSH_ESNB_PASSWORD
};

const sftpConfig_ESNA = {
    host: process.env.SSH_ESNA_HOST,
    port: process.env.SSH_ESNA_PORT,
    username: process.env.SSH_ESNA_USERNAME,
    password: process.env.SSH_ESNA_PASSWORD
};

const sftpConfig_ESMI = {
    host: process.env.SSH_ESMI_HOST,
    port: process.env.SSH_ESMI_PORT,
    username: process.env.SSH_ESMI_USERNAME,
    password: process.env.SSH_ESMI_PASSWORD
};

const remoteDir = process.env.PATH_SIMULATOR_REMOTE;
const localPath = process.env.PATH_LOCAL;
const downDir = process.env.PATH_DOWN_LOC;


router.get('/', function (req, res, next) {

    if (req.query) {
        simulatorController.retrieveByQuery(req.query)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else {
        simulatorController.retrieveAll()
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(err => {
                next(err)
            })
    }

   
});

router.post('/', function (req, res, next) {     
    simulatorController.retrieveOverData(req.body)
    .then((oldRst) =>{
        
        if(oldRst.length > 0){
            for(let i=0; i< oldRst.length; i++){
                if(oldRst[i].upld_file_path && oldRst[i].upld_file_path !== null ){
                    let upldPath = path.join(process.env.PATH_PG_UPLOAD, oldRst[i].upld_file_path,  oldRst[i].upld_file_nm);
                    try{
                        fs.unlinkSync(upldPath);
                    }catch(error){
                        if(error.code == 'ENOENT'){
                            console.log('파일 삭제 Error 발생');
                        }
                    }
                }

                if(oldRst[i].pgsc_file_path && oldRst[i].pgsc_file_path !== null ){
                    let pgscPath = path.join(process.env.PATH_PG_UPLOAD, oldRst[i].pgsc_file_path,  oldRst[i].pgsc_file_nm);
                    try{
                        fs.unlinkSync(pgscPath);
                    }catch(error){
                        if(error.code == 'ENOENT'){
                            console.log('파일 삭제 Error 발생');
                        }
                    }
                }

                simulatorController.delete(oldRst[i].idx_no);
            }
        }
        
    })
    .then(()=> {
        
        simulatorController.create(req.body)
        .then((result) => {        
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
    })
    
});


router.post('/file/:procCd/:siteCd', function (req, res, next) {
	uploadMiddleware(req.params.siteCd, req.params.procCd).single('file')(req, res, err => {
        
		if (err instanceof multer.MulterError) {
			console.error('file upload error');
			console.error(err);
			next({ code: 500 })
		}
		else if (err) {
			console.error(err);
			next({ code: 500 })
		}
		else {
			res.status(200).json({});
           
		}
	}) 
});


let sftp_OC = '';
let sftp_ESNA = '';
let sftp_ESNB = '';
let sftp_ESWA = '';
let sftp_ESMI = '';
    
router.post('/ftpSend', function (req, res, next) {
    
    const siteCd = req.body.siteCd;
    const insIdxNo = req.body.insIdxNo;

    res.status(200).json({});
   
    for(let i=0; i< siteCd.length; i++){

        let siteFolderPath = path.join(process.env.PATH_PG_UPLOAD, process.env.PATH_SIMULATOR_REMOTE,  siteCd[i]);
        let procFolderPath = path.join(siteFolderPath, req.body.procCd);

        let remoteSiteFolder = path.join(remoteDir, siteCd[i]);
        let remoteProcFolder = path.join(remoteSiteFolder, req.body.procCd);
    
        let siteInfo = {};

        if(siteCd[i] === 'ESWA'){
            siteInfo = sftpConfig_ESWA;

            if(sftp_ESWA !== '' ){
                sftp_ESWA.end();              
            }
            sftp_ESWA = new Client();
            
            try{               
                sftp_ESWA.connect(siteInfo)
                .then(()=>{           
                    return sftp_ESWA.exists(remoteProcFolder); 
                })
                .then((data) => {
                    if( data === false){
                        return sftp_ESWA.mkdir(remoteProcFolder, true)
                    }
                })
                .then(()=>{
                    console.log("===== upload ST "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    return sftp_ESWA.fastPut(procFolderPath+"/"+req.body.upld_file_nm, remoteProcFolder+"/"+req.body.upld_file_nm);
                })    
                .then(() => {
                    console.log("===== upload end "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    simulatorController.update(insIdxNo[i]);
                    sftp_ESWA.end();
                    sftp_ESWA = '';                    
                    
                    console.log("========> endend"+siteCd[i]);
                })
                .catch(err => {
                    if(err.code === 'ERR_GENERIC_CLIENT' ){
                        console.log("ESWA ", err.message);
                    }else{
                        console.log('ESWA ', err.message)
                        sftp_ESWA.end();
                    }
                    sftp_ESWA = '';
                    
                    let logData ={
                        if_nm: '프로그램 즉시 배포',
                        log_ctn:'ESWA '+ err.message,
                        rtn_data:' '
                    };
                    ifLogController.create(logData)
                    .then((result) => {
        
                    })
                    .catch((err) => {
                        next(err)
                    })
                    
                });
            }catch (error){
                if(sftp_ESWA !== '' ){
                    sftp_ESWA.end();                
                }
                
            }
        }else if(siteCd[i] === 'ESNB'){
            siteInfo = sftpConfig_ESNB;

            if(sftp_ESNB !== '' ){
                sftp_ESNB.end();                
            }
            sftp_ESNB = new Client();

            try{               
                sftp_ESNB.connect(siteInfo)
                .then(()=>{           
                    return sftp_ESNB.exists(remoteProcFolder);
                })
                .then((data) => {
                    if( data === false){
                        return sftp_ESNB.mkdir(remoteProcFolder, true)
                    }
                })
                .then(()=>{
                    console.log("===== upload ST "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    return sftp_ESNB.fastPut(procFolderPath+"/"+req.body.upld_file_nm, remoteProcFolder+"/"+req.body.upld_file_nm);
                })     
                .then(() => {
                    console.log("===== upload end "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    simulatorController.update(insIdxNo[i]);
                    sftp_ESNB.end();
                    sftp_ESNB = '';
                    
                    console.log("========> endend"+siteCd[i]);
                })
                .catch(err => {                   
                    if(err.code === 'ERR_GENERIC_CLIENT' ){
                        console.log("ESNB ", err.message);
                    }else{
                        console.log('ESNB ', err.message)
                        sftp_ESNB.end();
                    }
                    sftp_ESNB = '';    
                    
                    let logData ={
                        if_nm: '프로그램 즉시 배포',
                        log_ctn:'ESNB '+ err.message,
                        rtn_data:' '
                    };
                    
                    ifLogController.create(logData)
                    .then((result) => {
        
                    })
                    .catch((err) => {
                        next(err)
                    })
                    
                });
            }catch (error){
                if(sftp_ESNB !== '' ){
                    sftp_ESNB.end();                  
                }                
            }
        }else if(siteCd[i] === 'ESNA'){
            siteInfo = sftpConfig_ESNA;

            if(sftp_ESNA !== '' ){
                sftp_ESNA.end();              
            }

            sftp_ESNA = new Client();

            try{
                
                sftp_ESNA.connect(siteInfo)
                .then(()=>{           
                    return sftp_ESNA.exists(remoteProcFolder);
                })
                .then((data) => {
                    if( data === false){
                        return sftp_ESNA.mkdir(remoteProcFolder, true)
                    }
                })
                .then(()=>{
                    console.log("===== upload ST "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    return sftp_ESNA.fastPut(procFolderPath+"/"+req.body.upld_file_nm, remoteProcFolder+"/"+req.body.upld_file_nm);
                })    
                .then(() => {
                    console.log("===== upload end "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    simulatorController.update(insIdxNo[i]);
                    sftp_ESNA.end();
                    sftp_ESNA = '';
                    
                    console.log("========> endend"+siteCd[i]);
                })
                .catch(err => { 
                   
                    if(err.code === 'ERR_GENERIC_CLIENT' ){
                       console.log("ESNA ", err.message);
                    }else{
                       console.log('ESNA ', err.message)
                       sftp_ESNA.end();
                    }
                    sftp_ESNA = '';

                    let logData ={
                        if_nm: '프로그램 즉시 배포',
                        log_ctn:'ESNA '+ err.message,
                        rtn_data:' '
                    };
                    ifLogController.create(logData)
                    .then((result) => {
        
                    })
                    .catch((err) => {
                        next(err)
                    })
                    
                });
            }catch (error){
                sftp_ESNA.end();
                sftp_ESNA = '';               
            }
        }else if(siteCd[i] === 'ESMI'){
            siteInfo = sftpConfig_ESMI;

            
            if(sftp_ESMI !== '' ){
                sftp_ESMI.end();
            
            }

            sftp_ESMI = new Client();

            try{
                
                sftp_ESMI.connect(siteInfo)
                .then(()=>{           
                    return sftp_ESMI.exists(remoteProcFolder);
                })
                .then((data) => {
                    if( data === false){
                        return sftp_ESMI.mkdir(remoteProcFolder, true)
                    }
                })
                .then(()=>{
                    console.log("===== upload ST "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    return sftp_ESMI.fastPut(procFolderPath+"/"+req.body.upld_file_nm, remoteProcFolder+"/"+req.body.upld_file_nm);
                })    
                .then(() => {
                    console.log("===== upload end "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    simulatorController.update(insIdxNo[i]);
                    sftp_ESMI.end();
                    sftp_ESMI = '';

                    console.log("========> endend"+siteCd[i]);
                })
                .catch(err => {
                    if(err.code === 'ERR_GENERIC_CLIENT' ){
                        console.log("ESMI ", err.message);
                     }else{
                        console.log('ESMI ', err.message)
                        sftp_ESMI.end();
                     }
                    sftp_ESMI = '';

                    let logData ={
                        if_nm: '프로그램 즉시 배포',
                        log_ctn:'ESMI '+ err.message,
                        rtn_data:' '
                    };
                    ifLogController.create(logData)
                    .then((result) => {
        
                    })
                    .catch((err) => {
                        console.log("log catch>>", err);
                        next(err)
                    })
                    
                });
            }catch (error){
                console.error(error.message);
                if(sftp_ESMI !== '' ){
                    sftp_ESMI.end();
                
                }
                
            }
        }else if(siteCd[i] === 'OC'){
            siteInfo = sftpConfig_OC;

            if(sftp_OC !== '' ){
                sftp_OC.end();
               
            }

            sftp_OC = new Client();

            try{
                
                sftp_OC.connect(siteInfo)
                .then(()=>{           
                    return sftp_OC.exists(remoteProcFolder);
                })
                .then((data) => {
                    if( data === false){
                        return sftp_OC.mkdir(remoteProcFolder, true)
                    }
                })
                .then(()=>{
                    console.log("===== upload ST "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    return sftp_OC.fastPut(procFolderPath+"/"+req.body.upld_file_nm, remoteProcFolder+"/"+req.body.upld_file_nm);
                })    
                .then(() => {
                    console.log("===== upload end "+siteCd[i]+"====="+dayjs().format("YYYYMMDD HH:mm:ss"));
                    simulatorController.update(insIdxNo[i]);
                    sftp_OC.end();
                    sftp_OC = '';

                    console.log("========> endend"+siteCd[i]);
                })
                .catch(err => {
                    if(err.code === 'ERR_GENERIC_CLIENT' ){
                        console.log("OC ", err.message);
                    }else{
                        console.log('OC ', err.message)
                        sftp_OC.end();
                    }
                    sftp_OC = '';
                    
                    let logData ={
                        if_nm: '프로그램 즉시 배포',
                        log_ctn:'OC '+ err.message,
                        rtn_data:' '
                    };
                    ifLogController.create(logData)
                    .then((result) => {
        
                    })
                    .catch((err) => {
                        next(err)
                    })
                });
            }catch (error){
                if(sftp_OC !== '' ){
                    sftp_OC.end();
                
                }
                
            }
        }

    
    }
       
});


module.exports = router;
