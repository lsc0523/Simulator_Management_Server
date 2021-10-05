const userAuthService = require('../services/userAuthService');
const ROW_NUM = 20;
const userAuthController = {

    retrieveAll: function () {
        return new Promise((resolve, reject) => {
            userAuthService.retrieveAll()
                .then((res) => {
                    const filteredcode = res.map((code) => {
                        return {
                            id: code.id,
                            code: code.code,
                            name: code.name,
                            is_enabled: code.is_enabled,
                            ref1: code.ref1,
                            ref2: code.ref2,
                            ref3: code.ref3,
                            groupcode: {
                                id: code.groupcode.id,
                                groupcode: code.groupcode.groupcode,
                                name: code.groupcode.name,
                                is_enabled: code.groupcode.is_enabled,
                                ref1: code.groupcode.ref1,
                                ref2: code.groupcode.ref2,
                                ref3: code.groupcode.ref3
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
 
    retrieveByQuery: function ({ page, srchAuth, srchId, srchEmpNm }) {
        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        return new Promise((resolve, reject) => {
            userAuthService.retrieveAndCount({srchAuth, srchId, srchEmpNm, page}, limit, offset)
                .then(({ rows, count }) => {

                    const filteredcode = rows.map((data) => {                        
                        return {
                            idx_no: data.idx_no,
                            auth_cd_idx_no: data.auth_cd_idx_no,
                            auth_nm :data.auth.cmn_cd_nm,
                            user_id:data.user_id,
                            emp_nm : data.emp_nm,
                            org_nm : data.org_nm,
                            emp_no : data.emp_no
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
                data.auth_cd_idx_no &&
                data.user_id &&
                data.emp_no &&
                data.emp_nm) {
                userAuthService.retrieveIdChk(data)
                .then((res) =>{
                    if(res){
                        resolve({code:300})
                    }else{
                        userAuthService.create(data)
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
            userAuthService.update(id, data)
                .then((res) => {
                    resolve({ code: 200 })
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveId: function (id) {
        return new Promise((resolve, reject) => {
            userAuthService.retrieveId(id)
                .then((res) => {                    
                    resolve(res)
                })
                .catch((err) => { 
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

}

module.exports = userAuthController;
