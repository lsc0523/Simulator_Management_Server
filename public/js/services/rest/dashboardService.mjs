import RapService from './index.mjs'

const dashboardService = {

    /* 
        시뮬레이터(프로그램)
        버전 정보 
    */
    retrieveAll: function () {
        return RapService.get(`/api/dashboard`)
    },

    /* 
        사이트 (프로그램) 
        버전 정보 
    */
    retrieveSite: function (site_id) {
        return RapService.get(`/api/dashboard/site/${site_id}`)
    },
        
    /* 
        PC 리스트 
    */
    retrievePcList: function (site_id) {
        return RapService.get(`/api/dashboard/pcList/${site_id}`)
    },

    /* 
        PC Ver리스트 
    */
    retrievePcVerList: function (site_id) {
        return RapService.get(`/api/dashboard/pcVerList/${site_id}`)
    },
    
    /* 
        공정 PC별 버전
    */
    retrieveProgram: function (site_id, process_id ) {
        return RapService.get(`/api/dashboard/program?site_id=${site_id}&process_id=${process_id}`)
    },

    /* 
        중계 서버 최신 버전
    */
        retrieveProgramNewVer: function (site_id, process_id ) {
            return RapService.get(`/api/dashboard/programNewVer?site_id=${site_id}&process_id=${process_id}`)
        },
        
    /* 
        시뮬레이터 PC 상세
    */
    retrievePc: function (site_id ) {
        return RapService.get(`/api/dashboard/pc/${site_id}`)
    }

}

export default dashboardService;
