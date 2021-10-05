
import RapService from './index.mjs'

const pcService = {

    /* 
        pc 리스트
        
    */
    retrieveAll: function (page, options) {
        let queryString = "";
        if (options) {
            for (const key in options) {
                if (options[key]) {
                    queryString += `&${key}=${options[key]}`
                }
            }
        }
        return RapService.get(`/api/pc?page=${page ? `${page}` : "1"}${queryString}`)

    },

    /* 
        pc  등록 
    */
    create: function (data) {
        return RapService.post(`/api/pc`, data)
    },
        
    /* 
        pc 삭제
    */
    update: function (id, data) {
        return RapService.put(`/api/pc/${id}`, data)
    },

    delete: function(id) {
        return RapService.delete(`/api/pc/${id}`)
    }

}

export default pcService;
