const CodeModel = require('../models/CodeModel');
const GroupCodeModel = require('../models/GroupCodeModel');
const ProcessModel = require('../models/ProcessModel');
const ProcessSegmentModel = require('../models/ProcessSegmentModel');

const codeService = {

    retrieveAll: function () {
        return CodeModel.findAll({
            include: [
                {
                    model: GroupCodeModel,
                    required: true
                }
            ],
            order: [['idx_no', 'DESC']]
        })
    },

    retrieveAndCount: function (condition, limit, offset) {
        return CodeModel.findAndCountAll({
            include: [
                {
                    model: GroupCodeModel,
                    required: true,
                    where: condition
                }
            ],
            order: [['idx_no', 'DESC']],
            limit: limit,
            offset: offset,
            distinct: true
        })
    },

    retrieveById: function (id) {
        return CodeModel.findOne({
            include: [
                {
                    model: GroupCodeModel,
                    required: true
                }
            ],
            where: {
                idx_no: id
            }
        })
    },

    retrieveByGroupCode: function (groupcode) {
        return CodeModel.findAll({
            include: [
                {
                    model: GroupCodeModel,
                    required: true,
                    where: {
                        gr_cd: groupcode
                    }
                }
            ],
            order: [['idx_no', 'DESC']]
        })
    },

    retrieveCdChk:   function({cmn_cd}){
        return CodeModel.findOne({
            where:{
                cmn_cd: cmn_cd
            }
        })
    },

    create: function ({ cmn_cd, cmn_cd_nm, gr_idx_no, use_yn }) {
        return CodeModel.create({
            cmn_cd: cmn_cd,
            cmn_cd_nm: cmn_cd_nm,
            gr_idx_no: gr_idx_no,
            use_yn: use_yn
            
        })
    },

    update: function (idx_no, { cmn_cd, cmn_cd_nm, gr_idx_no, use_yn }) {
        return CodeModel.update({
            cmn_cd: cmn_cd,
            cmn_cd_nm: cmn_cd_nm,
            gr_idx_no: gr_idx_no,
            use_yn: use_yn
            
        }, {
            where: {
                idx_no: idx_no
            }
        })
    },

    delete: function (id) {
        return CodeModel.destroy({
            where: {
                idx_no: id
            }
        })
    }

}

module.exports = codeService
