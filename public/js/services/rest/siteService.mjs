import RapService from './index.mjs'

const siteService = {

    /* 
        site 리스트
        
    */
    retrieveAll: function () {
        return RapService.get(`/api/site`)
    },

    /* 
        site 정보 등록 
    */
    create: function (data) {
        return RapService.post(`/api/site`, data)
    },
        
    /* 
        site 수정
    */
    update: function (id, data) {
        return RapService.put(`/api/site/${id}`, data)
    }

}

export default siteService;