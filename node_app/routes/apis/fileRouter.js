const express = require('express');
const router = express.Router();

const Client = require('ssh2-sftp-client');
const sftp = new Client();    
const fs = require("fs"); 
const dayjs = require('dayjs');



const remoteDir = process.env.PATH_SIMULATOR_REMOTE;
const localPath = process.env.PATH_LOCAL;
const downDir = process.env.PATH_DOWN_LOC;

const ftpConfig = {
    host: '10.34.222.167',
    port: 21,
    username: 'sms_adm',
    password: 'p@ssw0rd!@',
    type : 'ftp'
};

const sftpConfig = {
    host: '10.34.222.167',
    port: 23,
    username: 'sftp_user',
    password: 'sftp_user'
};

router.get('/ftpUpload', function (req, res, next) {
 
    
    sftp.connect(sftpConfig)
    .then(()=>{
        console.log("remoteDir>>fastput3", dayjs().format("YYYYMMDD HH:mm:ss"));
        const fileName = "Downloads.zip";  // 
        // "SIMUL_Server.zip";   //   --> 요건 올라감 
        return sftp.fastPut("C:/Users/A64682/Downloads/"+fileName, remoteDir+"/"+fileName);
        //return sftp.fastPut(localPath+downDir+"/run_mysql.txt", remoteDir+'/run_mysql.txt');
        //return sftp.stat('/PROGRAM');
        //return sftp.put(localPath+"/docs/run_mysql.txt", "/");
    })    
    .then(() => {
        console.log("===== down end ====="+dayjs().format("YYYYMMDD HH:mm:ss"));
        sftp.end();
        console.log("========> endend");
    })
    .catch(err => {
        
        console.error("error>>>", err.message);
        sftp.end();
    });


/*
    try{

        

        console.log("connecnt next");

        ftp.on('open', function(){
            ftp.exist(remoteDir, function(e){
                
                if(e){
                    const fileName = "win32_11gR2_client.zip";  // --> 요건 안올라감
                    // "SIMUL_Server.zip";   //   --> 요건 올라감 
                    

                    //ftp.upload(localPath+"/docs/run_mysql.txt", remoteDir, function(err){
                        ftp.upload("C:/Users/A64682/Downloads/"+fileName, remoteDir, function(err){
                        console.log("err>>", err);
                        if(err){
                            console.log(err);
                        }else{
                            console.log("cccc");
                            ftp.close();
                        // res.status(200).end();
                        }        
                        
                    });
                }else{
                    console.log("경로 확인이 필요합니다.");
                }
            });
        });
        //서버 접속(connect)
        ftp.connect(ftpConfig);    

    } catch(error) {
        console.log("fileUpload error>>", error);
    }
    */
   
});

router.get('/ftpDownload', function (req, res, next) {
    try{

        conn.on('ready', () => {

            conn.sftp((err, sftp) => {
                console.log("sftp>>>", sftp);
                if (err) throw err;
                sftp.readdir(remoteDir, (err, list) => {
                    if (err) throw err;
                    let count = list.length;
    
                    console.log("remote count>>"+count);
    
                   
                        list.forEach(item => {
                            console.log("item>>",item);
                            if(item.filename === 'app.js'){
        
                                /* let remoteFile = remoteDir + '/' + item.filename;
                                let localFile = '/tmp/' + item.filename;
                                console.log('Downloading ' + remoteFile);
                                sftp.fastGet(remoteFile, localFile, (err) => {
                                if (err) throw err;
                                console.log('Downloaded to ' + localFile);
                                count--;
                                if (count <= 0) {
                                    conn.end();
                                }
                                }); */
                            }else{
                                console.log("@#@#@#     패스 : "+item.filename)
                            }
                        });
                    
                    
                });
            });
        }).on('error', (err) => {
            console.error('SSH connection stream problem');
            throw err;
        }).connect(sftpConfig);

        /*
        console.log("connecnt next");

        ftp.on('open', function(){
            ftp.exist(remoteDir, function(e){
                
                if(e){
                    const fileName = "win32_11gR2_client.zip";  // --> 요건 안올라감
                    // "SIMUL_Server.zip";   //   --> 요건 올라감 
                    

                    //ftp.upload(localPath+"/docs/run_mysql.txt", remoteDir, function(err){
                        ftp.download(remoteDir, localPath+downDir , function(err){
                        console.log("err>>", err);
                        if(err){
                            console.log(err);
                        }else{
                            console.log("cccc");
                            ftp.close();
                        // res.status(200).end();
                        }        
                        
                    });
                }else{
                    console.log("경로 확인이 필요합니다.");
                }
            });
        });
        //서버 접속(connect)
        ftp.connect(ftpConfig);   
        */ 

    } catch(error) {
        console.log("fileUpload error>>", error);
    }
});
	
module.exports = router;