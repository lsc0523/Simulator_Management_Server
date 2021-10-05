import RapService from './index.mjs'

const groupCodeService = {

    retrieve: function (page) {
        return RapService.get(`/api/groupcode?page=${page ? `${page}`:"1"}`)
    },
    retrieveAll: function () {
        return RapService.get(`/api/groupcode`)
    },
    view: function (id) {
        return RapService.get(`/api/groupcode/${id}`)
    },

    /* 
        @params data = {
            groupcode: string,
            name: stirng,
            is_enabled: boolean,
            ref1: string,
            ref2: string,
            ref3: string
        }
    */
    create: function (data) {
        return RapService.post(`/api/groupcode`, data)
    },

    /* 
        @params data = {
            name: stirng,
            is_enabled: boolean,
            ref1: string,
            ref2: string,
            ref3: string
        }
    */
    update: function(id, data) {
        return RapService.put(`/api/groupcode/${id}`, data)
    }
}

export default groupCodeService;
