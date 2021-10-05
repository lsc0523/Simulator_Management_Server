const groupCodeService = require('../services/groupCodeService');

const ROW_NUM = 20;

const groupCodeController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            groupCodeService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((code) => {
                        return {
                            idx_no: code.idx_no,
                            gr_cd_nm: code.gr_cd_nm,
                            gr_cd: code.gr_cd,
                            use_yn: code.use_yn
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

    retrieveByQuery: function ({ page }) {
        if (page < 1) {
            page = 1;
        }
        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            groupCodeService.retrieveAndCount({
                limit: limit,
                offset: offset
            })
                .then(({ rows, count }) => {
                    const filteredcode = rows.map((code) => {
                        return {
                            idx_no: code.idx_no,
                            gr_cd_nm: code.gr_cd_nm,
                            gr_cd: code.gr_cd,
                            use_yn: code.use_yn
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
            groupCodeService.retrieveById(id)
                .then((code) => {
                    filteredcode = {
                        id: code.id,
                        name: code.name,
                        groupcode: code.groupcode,
                        is_enabled: code.is_enabled,
                        ref1: code.ref1,
                        ref2: code.ref2,
                        ref3: code.ref3
                    }
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

            if (data && data.name && data.groupcode) {
                groupCodeService.create(data)
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
            groupCodeService.update(id, data)
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
            groupCodeService.delete(id)
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

module.exports = groupCodeController;
