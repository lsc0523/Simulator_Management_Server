import RapService from './index.mjs'

const videocallService = {

    /* 
        @params
            option = {
                startDate: YYYYMMDD
                endDate: YYYYMMDD
                region: number(region_id)
                type: number(videocall type_id)
                result: number(videocall result_id)
            }
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
        return RapService.get(`/api/videocall?page=${page ? `${page}` : "1"}${queryString}`)
    },

    retrieve: function (id) {
        return RapService.get(`/api/videocall/${id}`)
    },

    retrieveOperatorAll: function () {
        return RapService.get(`/api/videocall/operator`)
    },

    retrieveOperatorAtVideocall: function (id) {
        return RapService.get(`/api/videocall/${id}/operator`)
    },

    /* 
        @params
            option = {
                startDate: YYYYMMDD
                endDate: YYYYMMDD
            }
    */
    retrieveStatistic: function (options) {
        const queryString = makeQueryString(options);
        console.log(options)
        return RapService.get(`/api/videocall/statistic?${queryString}`)
    },

    retreiveMessage: function (id) {
        return RapService.get(`/api/videocall/${id}/message`);
    },

    createResult: function (id, data) {
        return RapService.post(`/api/videocall/${id}/result`, data)
    },

    updateResult: function (id, data) {
        return RapService.put(`/api/videocall/${id}/result`, data)
    },

    createFile: function (id, file) {
        return RapService.postFile(`/api/videocall/${id}/file`, 'file', file)
    }
}

const makeQueryString = function (options) {
    if (options && Object.entries(options).length > 0) {
        return Object.entries(options).map(e => e.join('=')).join('&');
    }
    return ""
}

export default videocallService;
