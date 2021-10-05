const resultService = require('../services/resultService');
const moment = require('moment');

const ROW_NUM = 20;
const resultController = {

    // retrieveAll: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType}) {
    //     return new Promise((resolve, reject) => {
    //         resultService.retrieveAll({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType})
    //             .then((res) => {                    
    //                 const filteredcode = res.map((data) => {
    //                     return {
    //                         idx_no: data.idx_no,
    //                         ste_cd_idx_no: data.ste_cd_idx_no,
    //                         ste_cd: data.site.cmn_cd,
    //                         ste_cd_nm: data.site.cmn_cd_nm,
    //                         pc_idx_no: data.pc_idx_no,
    //                         proc_cd_idx_no: data.proc_cd_idx_no,
    //                         proc_cd: data.proc.cmn_cd,
    //                         proc_cd_nm: data.proc.cmn_cd_nm,    
    //                         user_id: data.user_id,
    //                         misn_nm: data.misn_nm,
    //                         etc1: data.ref3,
    //                         etc2: data.etc2,
    //                         etc3: data.etc3,
    //                         etc4: data.etc4,
    //                         etc5: data.etc5,
    //                         etc6: data.etc6,
    //                         etc7: data.etc7,
    //                         etc8: data.etc8,
    //                         etc9: data.etc9,
    //                         etc10: data.etc10,
    //                         etc11: data.etc11,
    //                         etc12: data.etc12,
    //                         etc13: data.etc13,
    //                         etc14: data.etc14,
    //                         etc15: data.etc15,
    //                         rgst_id: data.rgst_id,
    //                         reg_dtm: data.reg_dtm
    //                     }
    //                 })
    //                 resolve(filteredcode)
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //                 reject({ code: 500 })
    //             })
    //     })
    // },

    retrieveByQuery: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, page}) {

        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);
        
        return new Promise((resolve, reject) => {
            let totCount = 0;
            resultService.retrieveListTotal({schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType})
                .then((count)=> {                    
                    totCount = count[0].count;                    
                })
                .then(() =>{
                    resultService.retrieveAndCount({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, page }, limit, offset)
                    .then(( res ) => {
                        const filteredData = res.map((data) => { 
                            return {                                
                                ste_cd_idx_no: data.ste_cd_idx_no,
                                ste_cd: data.site_cd,
                                pc_idx_no: data.pc_idx_no,
                                pc_nm : data.pc_nm,
                                proc_cd_idx_no: data.proc_cd_idx_no,
                                proc_cd: data.proc_cd,                                
                                sch_type_data: data.sch_type_data,                                
                                cnt : data.cnt
                            }
                        })
                        
                        resolve({
                            data: filteredData,
                            pageNum: Math.ceil(totCount / ROW_NUM)
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                        reject({ code: 500 })
                    })
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
             

            
        })
    },

    retrieveId: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, schDataVal, page}) {

        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);


        return new Promise((resolve, reject) => {
            resultService.retrieveById({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, schDataVal, page }, limit, offset)
                .then(({ rows, count }) => {
                    const filteredData = rows.map((data) => {                                                
                        return {
                            idx_no: data.idx_no,
                            ste_cd_idx_no: data.ste_cd_idx_no,
                            ste_cd: data.site.cmn_cd,
                            ste_cd_nm: data.site.cmn_cd_nm,
                            pc_idx_no: data.pc_idx_no,
                            proc_cd_idx_no: data.proc_cd_idx_no,
                            proc_cd: data.proc.cmn_cd,
                            proc_cd_nm: data.proc.cmn_cd_nm,    
                            user_id: data.user_id,
                            misn_nm: data.misn_nm,
                            etc1: data.etc1,
                            etc2: data.etc2,
                            etc3: data.etc3,  //moment(data.etc3).format('YYYY-MM-DD HH:mm:ss'),
                            etc4: data.etc4,
                            etc5: data.etc5,
                            etc6: data.etc6,
                            etc7: data.etc7,
                            etc8: data.etc8,                       
                            etc9: data.etc9,
                            rgst_id: data.rgst_id,
                            reg_dtm: data.reg_dtm
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
    }
    , retrievePcList: function({ste_cd_idx_no}){
        return new Promise((resolve, reject) => {
            resultService.retrievePcList({ ste_cd_idx_no})
            .then((rows) => {                
                resolve(rows); 
            })
            .catch((err) => {
                console.error(err);
                reject({ code: 500 })
            }) 
        })
    }
    
    ,retrieveIdExcel: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, schDataVal}) {

      
        return new Promise((resolve, reject) => {
            resultService.retrieveByIdExcel({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType, schDataVal})
                .then((rows) => {
                    const filteredData = rows.map((data) => {                                                
                        return {
                            idx_no: data.idx_no,
                            ste_cd_idx_no: data.ste_cd_idx_no,
                            ste_cd: data.site.cmn_cd,
                            ste_cd_nm: data.site.cmn_cd_nm,
                            pc_idx_no: data.pc_idx_no,
                            proc_cd_idx_no: data.proc_cd_idx_no,
                            proc_cd: data.proc.cmn_cd,
                            proc_cd_nm: data.proc.cmn_cd_nm,    
                            user_id: data.user_id,
                            misn_nm: data.misn_nm,
                            etc1: data.etc1,
                            etc2: data.etc2,
                            etc3: data.etc3,
                            etc4: data.etc4,
                            etc5: data.etc5,
                            etc6: data.etc6,                          
                            rgst_id: data.rgst_id,
                            reg_dtm: data.reg_dtm
                        }
                    })
                    resolve(
                        filteredData
                    )
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveByQueryExcel: function ({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType}) {

        return new Promise((resolve, reject) => {
          
            resultService.retrieveAndCountExcel({ schStDt, schEndDt, schSteCdIdxNo, schProcCdIdxNo, schPcIdxNo, schType })
            .then(( res ) => {
                const filteredData = res.map((data) => { 
                    return {                                
                        ste_cd_idx_no: data.ste_cd_idx_no,
                        ste_cd: data.site_cd,
                        pc_idx_no: data.pc_idx_no,
                        pc_nm : data.pc_nm,
                        proc_cd_idx_no: data.proc_cd_idx_no,
                        proc_cd: data.proc_cd,                                
                        sch_type_data: data.sch_type_data,                                
                        cnt : data.cnt.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                    }
                })
                
                resolve(filteredData )
            })
            .catch((err) => {
                console.error(err);
                reject({ code: 500 })
            })
              
        })
    }
    
}

module.exports = resultController;
