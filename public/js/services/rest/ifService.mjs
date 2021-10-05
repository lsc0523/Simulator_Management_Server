import RapService from './index.mjs'

const ifService = {

    /* 
        인터페이스 리스트
        
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
        return RapService.get(`/api/if?page=${page ? `${page}` : "1"}${queryString}`)
    }

}

export default ifService;
