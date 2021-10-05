const SiteRelModel = require('../models/SiteRelModel');
const CodeModel = require('../models/CodeModel');

const siteService = {

    retrieveAll: function () {
        return SiteRelModel.findAll({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    where: {
                        use_yn: 1
                    }
                }
            ],
            order: [['idx_no', 'DESC']]
        })
    },

    create: function ({ ste_cd_idx_no, rels_tm, rgst_id }) {
        return SiteRelModel.create({
            ste_cd_idx_no: ste_cd_idx_no,
            rels_tm: rels_tm,
            rgst_id: rgst_id
        })
    },

    update: function (idx_no, { rels_tm,upus_id }) {
        return SiteRelModel.update({
            rels_tm: rels_tm,
            upus_id: upus_id
        }, {
            where: {
                idx_no: idx_no
            }
        })
    }

}

module.exports = siteService
