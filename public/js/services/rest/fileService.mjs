import RapService from './index.mjs'

const fileService = {

    download: function (id) {
        return RapService.get(`/api/file/${id}/download`)
    },

    delete: function(id) {
        return RapService.delete(`/api/file/${id}`)
    }
}

export default fileService;
