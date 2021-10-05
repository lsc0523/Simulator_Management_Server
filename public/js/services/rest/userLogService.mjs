import RapService from './index.mjs'

const userLogService = {

    /* 
        사용자 log 리스트
        
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
        return RapService.get(`/api/userLog?page=${page ? `${page}` : "1"}${queryString}`)
    }
}

export default userLogService;