import RapService from './index.mjs'

const codeService = {

    retrieveAll: function (groupcode, page) {
        return RapService.get(`/api/code?page=${page ? `${page}`:"1"}${groupcode ? `&groupcode=${groupcode}` : ""}`)
    },
    retrieve: function (groupcode) {
        return RapService.get(`/api/code${groupcode ? `?groupcode=${groupcode}` : ""}`)
    },

    /* 
        @params
            data = {
                code: stirng,
                name: string,
                groupcode_id: number,
                is_enabled: boolean
            }
    */
    create: function (data) {
        return RapService.post(`/api/code`, data)
    },

    /* 
        @params
            data = {
                name: string,
                is_enabled: boolean                
            }
    */
    update: function (id, data) {
        return RapService.put(`/api/code/${id}`, data)
    }
}

export default codeService;
