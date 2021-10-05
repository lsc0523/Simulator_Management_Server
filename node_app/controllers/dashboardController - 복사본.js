const dashboardService = require('../services/dashboardService');

const ROW_NUM = 20;

const dashboardController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            dashboardService.retrieveAll()
                .then((res) => {                    
                    resolve(res)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },
    // 중계 사이트 버전 정보 / 적용 현황
    retrieveSite: function (id) {
        
        return new Promise((resolve, reject) => {
            dashboardService.retrieveSite(id)
                .then((res) => {   
                    const filteredData = res.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            proc_cd: data.cmn_cd,
                            proc_cd_nm: data.cmn_cd_nm,                            
                            ver_nm: data.ver_nm,
                            ste_rels_dtm: data.ste_rels_dtm
                        }
                    })
                    resolve(filteredData)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    // PC 
    retrievePcList: function (id) {
      //  let filteredData = '';
        return new Promise((resolve, reject) => {
            dashboardService.retrievePcList(id)
                .then((res) => {
                    const filteredData = res.map((data) => {  

                        return {
                            pc_id: data.idx_no,
                            pc_nm: data.pc_nm,                            
                            pc_ip: data.pc_ip                            
                        }
                    })
                    resolve( filteredData)
                })                     
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    // pc_공정 별 down VerList
    retrievePcVerList : function(pcIdxNo){
        return new Promise((resolve, reject) => {
            dashboardService.retrievePcVerList(pcIdxNo)
                .then((res) => {
                    const filteredData = res.map((data) => {                        
                        return {
                            pc_id: data.pc_id,
                            proc_cd: data.proc_cd,
                            ins_pgm_ver: data.ins_pgm_ver,                            
                            ins_new_ver: data.ins_new_ver,
                            rels_dtm: data.RELS_DTM  ,
                            dwn_pgm_ver: data.dwn_pgm_ver,
                            dwn_new_ver: data.dwn_new_ver,
                            dld_dtm: data.DLD_DTM                          
                        }
                    })
                    resolve( filteredData)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })

    },

    retrieveProgram: function (site_id, process_id) {
        return new Promise((resolve, reject) => {
            if (!site_id || !process_id) {
                reject({ code: 400 })
            }
            dashboardService.retrieveProgram(site_id, process_id)
                .then((res) => {
                    const filtered = res.map((data) => {                          
                        return {
                            pc_idx_no : data.PC_IDX_NO, 
                            rels_pgm_idx_no : data.RELS_PGM_IDX_NO, 
                            pc_nm : data.PC_NM,
                            pc_ip : data.PC_IP,
                            ver_nm : data.VER_NM
                        }
                    })
                    resolve(filtered)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveProgramNewVer: function (site_id, process_id) {
        return new Promise((resolve, reject) => {
            if (!site_id || !process_id) {
                reject({ code: 400 })
            }
            dashboardService.retrieveProgramNewVer(site_id, process_id)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrievePc: function (id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: 400 })
            }
            dashboardService.retrievePc(id)
                .then((notice) => {
                    if (!notice) {
                        reject({ code: 404 })
                    }
                    const filtered = {
                        id: notice.id,
                        author: notice.author.name,
                        type: notice.type.name,
                        title: notice.title,
                        text: notice.text,
                        start_date: notice.start_date,
                        end_date: notice.end_date,
                        created_date: notice.createdAt
                    }
                    resolve(filtered)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    }

}

module.exports = dashboardController;
