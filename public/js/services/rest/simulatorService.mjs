import RapService from './index.mjs'

const simulatorService = {

    /* 
        simulator 리스트
        
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
        return RapService.get(`/api/simulator?page=${page ? `${page}` : "1"}${queryString}`)
    },

    /* 
        simulator 정보 등록 
    */
    create: function (data) {
        return RapService.post('/api/simulator', data)
    },
    createFile: function (file, procCd, siteCd) {        
        return RapService.postFile(`/api/simulator/file/${procCd}/${siteCd}`, 'file', file);
    },
    downloadFile: function(data){
        return RapService.postFile('/api/simulator/fileDown', data);
    },
    fileFtpSend : function(data){        
        return RapService.postSFTP('/api/simulator/ftpSend', data);
    }
   
}

export default simulatorService;