const userService = require('../services/userService');
const pbkdf2Password = require('pbkdf2-password');

const hasher = pbkdf2Password();

const authController = {

    login: function (email, password) {

        return new Promise((resolve, reject) => {
            userService.retrieveUserByEmail(email)
                .then(user => {
                    console.log(user)
                    if (!user) reject({ code: 400, msg: "invalid input" })
                    hasher({ password: password, salt: user.salt }, function (err, pass, salt, hash) {
                        if (err) {
                            reject({ code: 500, msg: "internal server error" })
                        }
                        
                        if (hash === user.hash) {
                            resolve({
                                code: 200,
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                type: user.type,
                                language: user.language.name,
                                region: user.region.name
                            })
                        }
                        else {
                            reject({ code: 400, msg: "invalid input" })
                        }
                    })
                })
        })
        // user
    },

}

module.exports = authController;
