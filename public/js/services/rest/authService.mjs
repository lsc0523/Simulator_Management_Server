import RapService from './index.mjs'

const authService = {

    login: function (email, password) {
        return RapService.post('/api/auth/login', {
            email: email,
            password: password
        })
    },

    logout: function () {
        return RapService.post('/api/auth/logout', {})
    }
}

export default authService;
