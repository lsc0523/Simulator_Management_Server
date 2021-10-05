import RapService from './index.mjs'


const resultService = {

    /* 
        교육결과 리스트
        
    */
    retrieveAll: function (page,options) {
        let queryString = "";
        if (options) {
            for (const key in options) {
                if (options[key]) {
                    queryString += `&${key}=${options[key]}`
                }
            }
        }
        return RapService.get(`/api/result?page=${page ? `${page}` : "1"}${queryString}`)
    },

    /* 
        교육결과 상세
    */
    retrieveId: function (page, options) {   
        let queryString = "";
        if (options) {
            for (const key in options) {
                if (options[key]) {
                    queryString += `&${key}=${options[key]}`
                }
            }
        }    
        return RapService.get(`/api/result/detail?page=${page ? `${page}` : "1"}${queryString}`)
    }
    /** 사이트내 PC 목록 */
    , retrivePcList: function(siteCd){
        return RapService.get(`/api/result/pcList?ste_cd_idx_no=${siteCd}`)
    }
}

export default resultService;