const userService = require('../services/userService');
const pbkdf2Password = require('pbkdf2-password');

const { Op } = require('sequelize');
const hasher = pbkdf2Password();

const ROW_NUM = 20;

const userController = {

    retrieveAll: function (empNo) {
        return new Promise((resolve, reject) => {
            userService.retrieveUsers(empNo)
                .then((res) => {
                    const filteredUsers = res.map((user) => {
                        return {
                            name: user.name,
                            team: user.team,
                            grade: user.grade,
                            auth: user.auth,
                        }
                    })
                    resolve(filteredUsers)
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },

    retrieveByQuery: function ({ page, user_id, nick, local, type }) {
        const limit = ROW_NUM;
        const offset = ROW_NUM * (page - 1);

        let userType = []

        if (type === 'M') {
            userType = ['ADM', 'MNG']
        }
        else if (type === 'O') {
            userType = ['OP-C', 'OP-D']
        }
        else {
            userType = ['ADM', 'MNG', 'OP-C', 'OP-D']
        }

        return new Promise((resolve, reject) => {
            userService.retrieveAndCount({user_id, nick, local, userType},limit,offset)
                .then(({ rows, count }) => {
                    const filteredUsers = rows.map((user) => {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            device_id: user.device_id,
                            type: user.type,
                            language: (user.language && user.language.name) ? user.language.name : '',
                            region: (user.region && user.region.name) ? user.region.name : '',
                            is_enabled: user.is_enabled
                        }
                    })
                    resolve({
                        users: filteredUsers,
                        pageNum: Math.ceil(count / ROW_NUM),
                        count : count
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
            userService.retrieveById(id)
                .then((user) => {
                    if (!user) {
                        reject({ code: 404 })
                    }
                    else {
                        const filtered = {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            device_id: user.device_id,
                            type: user.type,
                            language: (user.language && user.language.name) ? user.language.name : '',
                            region: (user.region && user.region.name) ? user.region.name : '',
                            is_enabled: user.is_enabled
                        }
                        resolve(filtered)
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },


    retrieveByUid: function (uid) {
        return new Promise((resolve, reject) => {
            userService.retrieveUserByUid(uid)
                .then((user) => {
                    if (!user) {
                        resolve({ code: 404 })
                    }
                    else {
                        const filtered = {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            device_id: user.device_id,
                            type: user.type,
                            language: (user.language && user.language.name) ? user.language.name : '',
                            region: (user.region && user.region.name) ? user.region.name : '',
                            is_enabled: user.is_enabled
                        }
                        resolve(filtered)
                    }
                })
                .catch((err) => {
                    console.error(err);
                    reject({ code: 500 })
                })
        })
    },



    retrieveByType: function (type) {
        return new Promise((resolve, reject) => {
            if (type === 'M') {
                userService.retrieveUsersByType(['ADM', 'MNG'])
                    .then((res) => {
                        const filteredUsers = res.map((user) => {
                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                type: user.type,
                                language: (user.language && user.language.name) ? user.language.name : '',
                                region: (user.region && user.region.name) ? user.region.name : '',
                                is_enabled: user.is_enabled
                            }
                        })
                        resolve(filteredUsers)
                    })
                    .catch((err) => {
                        console.error(err);
                        reject({ code: 500 })
                    })
            }
            else if (type === 'O') {
                userService.retrieveUsersByType(['OP-C', 'OP-D'])
                    .then((res) => {
                        const filteredUsers = res.map((user) => {
                            return {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                device_id: user.device_id,
                                type: user.type,
                                language: (user.language && user.language.name) ? user.language.name : '',
                                region: (user.region && user.region.name) ? user.region.name : '',
                                is_enabled: user.is_enabled
                            }
                        })
                        resolve(filteredUsers)
                    })
                    .catch((err) => {
                        console.error(err);
                        reject({ code: 500 })
                    })
            }
            else {
                reject({
                    code: 400,
                    msg: "invalid type"
                })
            }
        })
    },

    create: function (data) {
        return new Promise((resolve, reject) => {

            if (data.type === 'ADM' || data.type === 'MNG' || data.type === 'OP-C') {
                if (data.password !== data.password_confirm) {
                    reject({ code: 400 })
                }
                hasher({ password: data.password }, function (err, pass, salt, hash) {
                    if (err) {
                        console.error(err);
                        reject({ code: 500 })
                    }
                    userService.createManager({
                        ...data,
                        salt: salt,
                        hash: hash
                    })
                        .then((res) => {
                            resolve({ code: 200 })
                        })
                        .catch((err) => {
                            console.error(err);
                            reject({ code: 500 })
                        })
                });

            }
            
            else {
                reject({ code: 400 })
            }
        })
    },

    update: function (id, data) {
        return new Promise((resolve, reject) => {

            if (!id) {
                reject({
                    code: 400,
                    msg: 'id is needed'
                })
            }

            if (data.type === 'ADM' || data.type === 'MNG' || data.type === 'OP-C') {
                if (data.password !== data.password_confirm) {
                    reject({ code: 400 })
                }
                // password is changed
                if (data.password) {
                    hasher({ password: data.password }, function (err, pass, salt, hash) {
                        if (err) {
                            console.error(err);
                            reject({ code: 500 })
                        }
                        userService.update(id, {
                            ...data,
                            salt: salt,
                            hash: hash
                        })
                            .then((res) => {
                                resolve({ code: 200 })
                            })
                            .catch((err) => {
                                console.error(err);
                                reject({ code: 500 })
                            })
                    });
                }
                // password is not changed
                else {
                    userService.update(id, {
                        ...data
                    })
                        .then((res) => {
                            resolve({ code: 200 })
                        })
                        .catch((err) => {
                            console.error(err);
                            reject({ code: 500 })
                        })
                }

            }
            else if (data.type === 'OP-D') {
                userService.update(id, data)
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

    delete: function (id) {
        return new Promise((resolve, reject) => {
            userService.delete(id)
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

module.exports = userController;
