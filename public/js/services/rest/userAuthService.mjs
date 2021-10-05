import RapService from './index.mjs'

const userAuthService = {

    /* 
        사용자 권한 리스트
        
    */
    retrieveAll: function (options, page) {
        let queryString = "";
        if (options) {
            for (const key in options) {
                if (options[key]) {
                    queryString += `&${key}=${options[key]}`
                }
            }
        }
        return RapService.get(`/api/userAuth?page=${page ? `${page}` : "1"}${queryString}`)
    },

    /* 
        사용자 권한 등록 
    */
    create: function (data) {
        return RapService.post(`/api/userAuth`, data)
    },
        
    /* 
        사용자 권한 수정
    */
    update: function (id, data) {
        return RapService.put(`/api/userAuth/${id}`, data)
    }
    , retrieveId : function (id){
        return RapService.get(`/api/userAuth/${id}`)
    }
}

export default userAuthService;