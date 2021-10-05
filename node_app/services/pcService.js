const CodeModel = require('../models/CodeModel');
const PcModel = require('../models/PcModel');
const ProgramModel = require('../models/ProgramModel');
const PcDldModel = require('../models/PcDldModel');
const moment = require('moment');

const pcService = {

    retrieveAll: function () {
        return PcModel.findAll({
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
    retrieveAndCount: function (condition, limit, offset) {
        const resultCondition = {del_yn : 0};
        if (condition.schSteCdIdxNo) {
            resultCondition.ste_cd_idx_no = condition.schSteCdIdxNo;            
        }
        return PcModel.findAndCountAll({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    where: {
                        use_yn: 1
                    }
                }
            ],
            required: Object.keys(resultCondition).length !== 0,
            where: resultCondition,
            order: [['idx_no', 'DESC']], 
            limit: limit,
            offset: offset,
            distinct: true
        })
    },
    create: function ({ste_cd_idx_no, pc_nm, pc_ip, loc_desc, rgst_nm }) {
        return PcModel.create({
            ste_cd_idx_no: ste_cd_idx_no,
            pc_nm: pc_nm,
            pc_ip: pc_ip,
            loc_desc: loc_desc,
            rgst_nm: rgst_nm
        })
    }, 

    update: function (idx_no, {ste_cd_idx_no, pc_nm, pc_ip, loc_desc, upus_nm}) {
        return PcModel.update({
            ste_cd_idx_no: ste_cd_idx_no,
            pc_nm: pc_nm,
            pc_ip: pc_ip,
            loc_desc: loc_desc,
            upus_nm: upus_nm,
            upus_dtm: moment().format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: {
                idx_no: idx_no
            }
        })
    },
    searchCheck: function (site, process) {

        return ProgramModel.findAll({
            
            include: [
                {
                    model: CodeModel,
                    as: 'site',
                    where: {
                        use_yn: 1,
                        cmn_cd : site
                    }
                },
                {
                    model: CodeModel,
                    as: 'proc',
                    where: {
                        use_yn: 1,
                        cmn_cd : process
                    }
                }
            ],
            order: [['idx_no', 'DESC']],
            limit: 1,
            offset: 0,
            distinct: true
        })
        
    },

    retrieveIp: function (ip) {

        return PcModel.findOne({
            where:{
                pc_ip:ip,
                del_yn : 0
            }
            
        })
        
    },

    setUpdate: function (pg_id, ip, type, pc_idx_no) {
        const updateText = {};
        
        
            if (type == 'D') {
                updateText.dld_pgm_idx_no = pg_id;
                updateText.dld_dtm = moment().format('YYYY-MM-DD HH:mm:ss')
                updateText.pc_idx_no = pc_idx_no;
                
                return PcDldModel.create(
                   updateText
              )
            }
            if (type == 'I') {
                updateText.rels_pgm_idx_no = pg_id;
                updateText.rels_dtm = moment().format('YYYY-MM-DD HH:mm:ss')
                return PcDldModel.findOne({
                    where:{pc_idx_no:pc_idx_no,
                        dld_pgm_idx_no : pg_id}
                }).then( (result)=>{
                    if(!result){ //해당 IP , 프로그램 , 다운로드 된 이력 없을 경우
                
                    }
                    else{ 
                        return PcDldModel.update(
                            updateText
                        , {
                            where: {
                                pc_idx_no : pc_idx_no,
                                dld_pgm_idx_no : pg_id
                            }
                        })
                    }
                })
            }

    },

    delete: function (id) {
        return PcModel.destroy({
            where: {
                idx_no: id
            }
        })
    }

}

module.exports = pcService
