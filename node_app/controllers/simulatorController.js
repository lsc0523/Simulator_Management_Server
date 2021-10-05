const simulatorService = require('../services/simulatorService');

const ROW_NUM = 20;

const simulatorController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            simulatorService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            ste_cd: data.site.cmn_cd,
                            ste_cd_nm: data.site.cmn_cd_nm,
                            proc_cd: data.proc.cmn_cd,
                            proc_cd_nm: data.proc.cmn_cd_nm,
                            ver_nm: data.ver_nm,
                            reg_dtm: data.reg_dtm,
                            rels_way: data.rels_way,
                            upld_file_nm: data.upld_file_nm,
                            upld_file_path: data.upld_file_path,
                            pgsc_file_nm: data.pgsc_file_nm,
                            pgsc_file_path: data.pgsc_file_path,
                            rgst_nm: data.rgst_nm,
                            memo_ctn: data.memo_ctn,
                            pcsgname : data.processsegment.pcsgname,
                            procname : data.process.procname
                        }
                    })
                    resolve(filteredcode)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },
    retrieveByQuery: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, page}) {

        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            simulatorService.retrieveAndCount({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, page }, limit, offset)
                .then(({ rows, count }) => {                   
                    const filteredData = rows.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            ste_cd: data.site.cmn_cd,
                            ste_cd_nm: data.site.cmn_cd_nm,
                            proc_cd: data.proc.cmn_cd,
                            proc_cd_nm: data.proc.cmn_cd_nm,
                            ver_nm: data.ver_nm,
                            reg_dtm: data.reg_dtm,
                            rels_way: data.rels_way,
                            upld_file_nm: data.upld_file_nm,
                            upld_file_path: data.upld_file_path,
                            pgsc_file_nm: data.pgsc_file_nm,
                            pgsc_file_path: data.pgsc_file_path,
                            rgst_nm: data.rgst_nm,
                            memo_ctn: data.memo_ctn,
                            pcsgname : data.processsegment.pcsgname,
                            procname : data.process.procname
                        }
                    })
                    resolve({
                        data: filteredData,
                        pageNum: Math.ceil(count / ROW_NUM)
                    })
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    create: function (data) {
        return new Promise((resolve, reject) => {

            if (data &&
                data.proc_cd_idx_no &&
                data.ste_cd_idx_no &&
                data.upld_file_nm) {
                    simulatorService.create(data)
                    .then((res) => {                          
                        resolve({ code: 200 , idx_no : res.idx_no, ste_cd_idx_no : res.ste_cd_idx_no})
                    })
                    .catch((err) => {
                        console.error(err);
                        reject({ code: 500 })
                    })
            }
            else {
                reject({ code: 400 })
            }
        })
    },
    update : function (data){
        
        return new Promise((resolve, reject) => {
            if(data) {
                 simulatorService.update(data)
                 .then((res) => {
                    resolve({ code: 200 })
                 })
                 .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
            }
        })
    },
    retrieveOverData: function(data) {
        
        return new Promise((resolve, reject) => {
            simulatorService.retrieveOverData(data)
            .then((rows) => {                  
                resolve(rows);
            })
            .catch((err) => {
                console.error(err);
                reject({ code: 500 })
            })
        })
    },
    delete: function (id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: 400 })
            }
            simulatorService.delete(id)
            .then((res) => {
                resolve({ code: 200 })
            })
            .catch((err) => {
                console.error(err);
                reject({ code: 500 })
            })
        })
    }
}

module.exports = simulatorController;
