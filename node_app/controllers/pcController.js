const pcService = require('../services/pcService');
const ROW_NUM = 20;
const pcController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            pcService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            pc_nm: data.pc_nm,
                            site_idx_no:data.code.idx_no,
                            cmn_cd: data.code.cmn_cd,
                            cmn_cd_nm: data.code.cmn_cd_nm,
                            pc_ip: data.pc_ip,
                            loc_desc: data.loc_desc,
                            rgst_id: data.rgst_id,
                            rgst_nm: data.rgst_nm,
                            upus_id: data.upus_id,
                            upus_nm: data.upus_nm                            
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
    retrieveByQuery: function ({ schSteCdIdxNo, page}) {

        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            pcService.retrieveAndCount({ schSteCdIdxNo, page }, limit, offset)
                .then(({ rows, count }) => {
                    const filteredData = rows.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            pc_nm: data.pc_nm,
                            site_idx_no:data.code.idx_no,
                            cmn_cd: data.code.cmn_cd,
                            cmn_cd_nm: data.code.cmn_cd_nm,
                            pc_ip: data.pc_ip,
                            loc_desc: data.loc_desc,
                            rgst_id: data.rgst_id,
                            rgst_nm: data.rgst_nm,
                            upus_id: data.upus_id,
                            upus_nm: data.upus_nm,
                            del_yn: data.del_yn
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
                data.ste_cd_idx_no &&
                data.pc_ip ) {
                pcService.create(data)
                    .then((res) => {
                        resolve({ code: 200 })
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

    update: function (id, data) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: 400 })
            }
            pcService.update(id, data)
                .then((res) => {
                    resolve({ code: 200 })
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    searchCheck: function (site, process) {
        
        return new Promise((resolve, reject) => {
            
            pcService.searchCheck(site, process)
                .then((res) => {
                    const filteredcode = res.map((data) => {

                        return {
                            program_id: data.idx_no,
                            file_nm: data.upld_file_nm,
                            site_batch_date: data.ste_rels_dtm
                                      
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
    setUpdate: function (pg_id, ip, type) {
        return new Promise((resolve, reject) => {
            pcService.retrieveIp(ip)
                .then((res) => {
                    if(!res){
                        //todo api update 중 PC 정보 없어서 에러 log
                        reject({code:500,
                            msg:'This PC is not registered.'})
                    }else{
                        pcService.setUpdate(pg_id, ip, type, res.idx_no)
                        .then((data) => {
                            resolve({ code: 200
                            ,msg:'success' })
                        })
                        .catch((err) => {
                            //todo api update 중 일반  에러 log
                            console.error(err);
                            reject({ code: 500 })
                        })
                    }
                    
                })
                .catch((err) => {
                    //todo api PC 정보 체크 중 일반  에러 log
                    console.error(err);
                    reject({code:500})
                })
        })               
    },
    delete: function (id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: 400 })
            }
            pcService.delete(id)
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

module.exports = pcController;
