const codeService = require('../services/codeService');

const ROW_NUM = 20;

const codeController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            codeService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((code) => {
                        return {
                            idx_no: code.idx_no,
                            cmn_cd: code.cmn_cd,
                            cmn_cd_nm: code.cmn_cd_nm,
                            use_yn: code.use_yn,
                            pcsgid: (code.pcsgid===undefined || code.pcsgid===null) ? null : code?.pcsgid,
                            procid: (code.procid===undefined || code.procid===null) ? null : code?.procid,
                            groupcode: {
                                idx_no: code.groupcode.idx_no,
                                gr_cd: code.groupcode.gr_cd,
                                gr_cd_nm: code.groupcode.gr_cd_nm,
                                use_yn: code.groupcode.use_yn
                            },
                            process: (code.process===null) ? null : {
                                procid : code.process.procid,
                                procname : code.process.procname
                            },
                            processsegment: (code.processsegment===null) ? null : {
                                pcsgid : code.processsegment.pcsgid,
                                pcsgname : code.processsegment.pcsgname
                            }
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

    retrieveByQuery: function ({ page, groupcode }) {
        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        const condition = groupcode ? {
            gr_cd: groupcode
        } : {
            };


        return new Promise((resolve, reject) => {
            codeService.retrieveAndCount(condition, limit, offset)
                .then(({ rows, count }) => {

                    const filteredcode = rows.map((code) => {
                        return {
                            idx_no: code.idx_no,
                            cmn_cd: code.cmn_cd,
                            cmn_cd_nm: code.cmn_cd_nm,
                            use_yn: code.use_yn,
                            groupcode: {
                                idx_no: code.groupcode.idx_no,
                                gr_cd: code.groupcode.gr_cd,
                                gr_cd_nm: code.groupcode.gr_cd_nm,
                                use_yn: code.groupcode.use_yn
                            }
                        }
                    })
                    resolve({
                        data: filteredcode,
                        pageNum: Math.ceil(count / ROW_NUM)
                    })
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveById: function (id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: 400 })
            }
            codeService.retrieveById(id)
                .then((code) => {
                    if (!code) {
                        reject({ code: 404 })
                    }
                    const filteredcode = {
                        idx_no: code.idx_no,
                        cmn_cd: code.cmn_cd,
                        cmn_cd_nm: code.cmn_cd_nm,
                        use_yn: code.use_yn,
                        groupcode: {
                            idx_no: code.groupcode.idx_no,
                            gr_cd: code.groupcode.gr_cd,
                            gr_cd_nm: code.groupcode.gr_cd_nm,
                            use_yn: code.groupcode.use_yn
                        }
                    }
                    resolve(filteredcode)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveByGroupCode: function (groupcode) {
        return new Promise((resolve, reject) => {
            codeService.retrieveByGroupCode(groupcode)
                .then((res) => {
                    const filteredcode = res.map((code) => {
                        return {
                            idx_no: code.idx_no,
                            cmn_cd: code.cmn_cd,
                            cmn_cd_nm: code.cmn_cd_nm,
                            use_yn: code.use_yn,
                            groupcode: {
                                idx_no: code.groupcode.idx_no,
                                gr_cd: code.groupcode.gr_cd,
                                gr_cd_nm: code.groupcode.gr_cd_nm,
                                use_yn: code.groupcode.use_yn
                            }
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

    create: function (data) {
        return new Promise((resolve, reject) => {

            if (data &&
                data.cmn_cd &&
                data.cmn_cd_nm &&
                data.gr_idx_no &&
                data.use_yn) {
                codeService.retrieveCdChk(data)
                .then((res)=>{
                    if(res){
                        resolve({code:300})
                    }else{
                        codeService.create(data)
                        .then((res) => {
                            resolve({ code: 200 })
                        })
                        .catch((err) => {
                            console.error(err);
                            reject({ code: 500 })
                        })
                    }
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
            if (!id || !data) {
                reject({ code: 400 })
            }
            codeService.update(id, data)
                .then((res) => {
                    resolve({ code: 200 })
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
            codeService.delete(id)
                .then((res) => {
                    resolve()
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    }

}

module.exports = codeController;
