const userLogService = require('../services/userLogService');

const ROW_NUM = 20;
const userLogController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            userLogService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((data) => {
                        return {
                            IDX_NO : data.idx_no,
                            LOG_CTN : data.LOG_CTN,
                            RGST_NM : data.RGST_NM,
                            REG_DTM :  data.REG_DTM
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
    retrieveByQuery: function ({ page, schStDt, schEndDt}) {
        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            userLogService.retrieveAndCount(schStDt, schEndDt, limit, offset)
                .then(({ rows, count }) => {

                    const filteredcode = rows.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            log_ctn: data.log_ctn,
                            rgst_id: data.rgst_id,
                            reg_dtm: data.reg_dtm
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
    create: function (data) {
        return new Promise((resolve, reject) => {
            if (data &&
                data.log_ctn &&
                data.rgst_id) {
                userLogService.create(data)
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
}


module.exports = userLogController;
