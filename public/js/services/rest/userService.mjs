                  import RapService from './index.mjs'

const userService = {

    /* 
        @params
            type: "M" | "O"
    */
    retrieve: function (options, page) {
        let queryString = "";
        if (options) {
            for (const key in options) {
                if (options[key]) {
                    queryString += `&${key}=${options[key]}`
                }
            }
        }
        return RapService.get(`/api/user?page=${page ? `${page}`:"1"}${queryString}`)
    },
    /* 
        전체 조회
    */
    retrieveAll: function () {
        return RapService.get(`/api/user`)
    },

    /* 
        @params
            data = {
                type: "ADM" | "MNG" | "OP-C" | "OP-D" ,
                email: string,
                device_id: string,
                name: string,
                password: string,
                password_confirm: string,
                language_id: number,
                region_id: number
            }
    */
    create: function (data) {
        return RapService.post(`/api/user`, data)
    },

    /*
        @params
            data = {
                type: "ADM" | "MNG" | "OP-C" | "OP-D",
                name: string,
                password: string,
                password_confirm: string,
                language_id: number,
                region_id: number
          }
    */      
    update: function(id, data) {
        return RapService.put(`/api/user/${id}`, data)
    },

    
    delete: function(id) {
        return RapService.delete(`/api/user/${id}`)
    }

}

export default userService;
