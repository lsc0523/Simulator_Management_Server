const siteService = require('../services/siteService');

const siteController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            siteService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            rels_tm: data.rels_tm,
                            site: {
                                idx_no: data.code.idx_no,
                                cmn_cd: data.code.cmn_cd,
                                cmn_cd_nm: data.code.cmn_cd_nm,
                                use_yn: data.code.use_yn
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
                data.ste_cd_idx_no &&
                data.rels_tm) {
                siteService.create(data)
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
            if (!id || !data) {
                reject({ code: 400 })
            }
            siteService.update(id, data)
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

module.exports = siteController;
