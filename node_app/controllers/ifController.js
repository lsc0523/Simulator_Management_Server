const ifService = require('../services/ifService');

const ROW_NUM = 20;
const ifController = {

    retrieveByQuery: function ({ page, schStDt, schEndDt}) {

        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            ifService.retrieveAndCount(schStDt, schEndDt, limit, offset)
                .then(({ rows, count }) => {                   
                    const filteredData = rows.map((data) => {
                        return {
                            idx_no: data.idx_no,
                            if_nm: data.if_nm,
                            log_ctn: data.log_ctn,
                            rtn_data: data.rtn_data,
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
    },
    create: function (data) {
        return new Promise((resolve, reject) => {
            if (data &&
                data.if_nm &&
                data.log_ctn &&
                data.rtn_data) {
                ifService.create(data)
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

module.exports = ifController;
