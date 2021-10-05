const CodeModel = require('../models/CodeModel');
const ProcessModel = require('../models/ProcessModel');
const ProcessSegmentModel = require('../models/ProcessSegmentModel');
const ProgramModel = require('../models/ProgramModel');
const moment = require('moment');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../models/connection');

const simulatorService = {

    retrieveAll: function () {
        return ProgramModel.findAll({
            
            include: [
                {
                    model: CodeModel,
                    as: 'site'
                },
                {
                    model: CodeModel,
                    as: 'proc'
                },
                {
                    model: ProcessModel,
                    as: 'process'
                },
                {
                    model: ProcessSegmentModel,
                    as: 'processsegment'
                }
            ],
            order: [['idx_no', 'DESC']]
        })
    },
    retrieveAndCount: function (condition, limit, offset) {
        console.log("@#@#@#     condition.schStDt: "+condition.schStDt+", condition.schEndDt"+condition.schEndDt)
        const resultCondition = {};
        if (condition.schSteCdIdxNo) {
            resultCondition.ste_cd_idx_no = condition.schSteCdIdxNo;
        }
        if (condition.schProcCdIdxNo) {
            resultCondition.proc_cd_idx_no = condition.schProcCdIdxNo;
        }
        if (condition.schStDt && condition.schEndDt) {
            resultCondition.reg_dtm = {
                 [Op.between]: [condition.schStDt, (Number(condition.schEndDt) + 1).toString()] 
            }
        }else if(condition.schStDt){
            resultCondition.reg_dtm = {
                [Op.gte]: condition.schStDt || 19990101
            } 
        }else if(condition.schEndDt){
            resultCondition.reg_dtm = {
                [Op.lte]: (Number(condition.schEndDt) + 1).toString()
            } 
        }
        
        return ProgramModel.findAndCountAll({
            include: [
                {
                    model: CodeModel,
                    as: 'site'
                },
                {
                    model: CodeModel,
                    as: 'proc'
                },
                {
                    model: ProcessModel,
                    as: 'process'
                },
                {
                    model: ProcessSegmentModel,
                    as: 'processsegment'
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

    create: function ({ proc_cd_idx_no, ste_cd_idx_no, rels_way, upld_file_nm, upld_file_path,  
        upld_file_capa, ver_nm, pgsc_file_nm, pgsc_file_path, pgsc_file_capa, rgst_nm, memo_ctn}) {
        return ProgramModel.create({
            proc_cd_idx_no: proc_cd_idx_no,
            ste_cd_idx_no: ste_cd_idx_no,
            rels_way : rels_way, 
            upld_file_nm : upld_file_nm,
            upld_file_path : upld_file_path,
            upld_file_capa : upld_file_capa,    
            ver_nm : ver_nm, 
            pgsc_file_nm : pgsc_file_nm,
            pgsc_file_path : pgsc_file_path,
            pgsc_file_capa : pgsc_file_capa,
            rgst_nm : rgst_nm,
            memo_ctn: memo_ctn
        })
    },
    
    update : function (insIdxNo){
        return ProgramModel.update(
            { ste_rels_dtm : moment().format('YYYY-MM-DD HH:mm:ss')}
            ,{where : {idx_no : insIdxNo }
        })
    },

    retrieveOverData : function(condition){ 
        return sequelize.query(
            'SELECT idx_no, upld_file_nm, upld_file_path, pgsc_file_nm, pgsc_file_path ' +
            'FROM TB_GEBTR_PGM_M ' +
            'WHERE  idx_no NOT IN ( ' +
            '    SELECT top(9) idx_no FROM TB_GEBTR_PGM_M WHERE PROC_CD_IDX_NO = ' + condition.proc_cd_idx_no + 
            '       AND ste_Cd_idx_no = ' + condition.ste_cd_idx_no + ' order by idx_no desc ' +
            '    ) ' +
            '    AND proc_cd_idx_no = ' + condition.proc_cd_idx_no +
            '    AND ste_Cd_idx_no = ' + condition.ste_cd_idx_no 
            , {raw: true, type: QueryTypes.SELECT} )
    },

    delete: function (id) {
        return ProgramModel.destroy({
            where: {
                idx_no: id
            }
        })
    }
}

module.exports = simulatorService
