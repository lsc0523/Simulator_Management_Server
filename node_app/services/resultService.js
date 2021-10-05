const CodeModel = require('../models/CodeModel');
const ResultModel = require('../models/ResultModel');
const PcModel = require('../models/PcModel'); 

const { Op, QueryTypes } = require('sequelize');

const sequelize = require('../models/connection');

const resultService = {

    // retrieveAll: function (condition) {
    //     const resultCondition = {};
    //     if (condition.schSteCdIdxNo) {
    //         resultCondition.ste_cd_idx_no = condition.schSteCdIdxNo;
    //     }
    //     if (condition.schProcCdIdxNo) {
    //         resultCondition.proc_cd_idx_no = condition.schProcCdIdxNo;
    //     }
    //     if (condition.schPcIdxNo) {
    //         resultCondition.pc_idx_no = condition.schPcIdxNo;
    //     }
        
    //     if (condition.schStDt && condition.schEndDt) {
    //         resultCondition.reg_dtm = {
    //              [Op.between]: [condition.schStDt, (Number(condition.schEndDt) + 1).toString()] 
    //         }
    //     }else if(condition.schStDt){
    //         resultCondition.reg_dtm = {
    //             [Op.gte]: condition.schStDt || 19990101
    //         } 
    //     }else if(condition.schEndDt){
    //         resultCondition.reg_dtm = {
    //             [Op.lte]: (Number(condition.schEndDt) + 1).toString()
    //         } 
    //     }

    //     return ResultModel.findAll({
    //         include: [
    //             {
    //                 model: CodeModel,
    //                 as: 'site'
    //             },
    //             {
    //                 model: CodeModel,
    //                 as: 'proc'
    //             },
    //             {   
    //                 model: PcModel,
    //                 as: 'pci'
    //             }
    //         ],
    //         required: Object.keys(resultCondition).length !== 0,
    //         where: resultCondition,            
    //         order: [['idx_no', 'DESC']]
    //     })
    // },
    retrieveListTotal: function (condition) {
        let queryString = '';
        let whereQuery = '';
 
         if (condition.schSteCdIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[ste_cd_idx_no] = ' + condition.schSteCdIdxNo;                        
         }
         if (condition.schProcCdIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[proc_cd_idx_no] = ' + condition.schProcCdIdxNo;
         }
         if (condition.schPcIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[pc_idx_no] = ' + condition.schPcIdxNo;
         }
 
         if (condition.schStDt && condition.schEndDt) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += " [result].[reg_dtm] between '" + condition.schStDt + "' and '" + (Number(condition.schEndDt) + 1).toString() + "' ";
             
         }else if(condition.schStDt){
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[reg_dtm] >= ' + condition.schStDt || 19990101;
         }else if(condition.schEndDt){
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[reg_dtm] <= ' + (Number(condition.schEndDt) + 1).toString();
             
         } 
        
         queryString = 'SELECT count(*) as count ' +
             'from ( ' +
             '   SELECT ' +
             '      [result].[ste_cd_idx_no], [result].[pc_idx_no],  ' +
             '      [result].[proc_cd_idx_no]' ;
        if(condition.schType === 'Users'){
            queryString += '      , [result].[user_id] AS [sch_type_data] ' +
                    '      , count(\'user_id\') AS [cnt], ';
        }else{
            queryString += '      , [result].[misn_nm] AS [sch_type_data] ' +
                    '      , count(\'misn_nm\') AS [cnt], ';
        }
             
          queryString +=   '      [site].[cmn_cd] AS [site_cd], [proc].[cmn_cd] AS [proc_cd], ' +
             '      [pc].[pc_nm] ' +
             '   FROM ' +
             '      [TB_GEBTR_MISN_RESULT_M] AS [result] ' +
             '      LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [site] ON ' +
             '           [result].[ste_cd_idx_no] = [site].[idx_no] ' +
             '       LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [proc] ON ' +
             '           [result].[proc_cd_idx_no] = [proc].[idx_no] '+
             '       LEFT OUTER JOIN [TB_GEBTR_PC_M] AS [pc] ON ' +
             '          [result].[pc_idx_no] = [pc].[idx_no] ' +
             '   WHERE ' + whereQuery +
             '   GROUP BY  ' +
             '       [result].[ste_cd_idx_no], ' +
             '       [result].[pc_idx_no], ' +
             '       [site].[cmn_cd], ' +
             '       [proc].[cmn_cd], ' +
             '       [pc].[pc_nm], ' +
             '       [result].[proc_cd_idx_no], ' ;
             if(condition.schType === 'Users'){
                queryString += '       [result].[user_id] ' ;
             } else{
                queryString += '       [result].[misn_nm] ' ; 
             }
            queryString += ') mst ';
 
         return sequelize.query(
             queryString
             , {row: true, type: QueryTypes.SELECT}
         );
         
         
     },
    retrieveAndCount: function (condition, limit, offset) {
       let queryString = '';
       let whereQuery = '';

        if (condition.schSteCdIdxNo) {
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += ' [result].[ste_cd_idx_no] = ' + condition.schSteCdIdxNo;                        
        }
        if (condition.schProcCdIdxNo) {
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += ' [result].[proc_cd_idx_no] = ' + condition.schProcCdIdxNo;
        }
        if (condition.schPcIdxNo) {
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += ' [result].[pc_idx_no] = ' + condition.schPcIdxNo;
        }

        if (condition.schStDt && condition.schEndDt) {
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += " [result].[reg_dtm] between '" + condition.schStDt + "' and '" + (Number(condition.schEndDt) + 1).toString()  + "' ";
            
        }else if(condition.schStDt){
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += ' [result].[reg_dtm] >= ' + condition.schStDt || 19990101;
        }else if(condition.schEndDt){
            if(whereQuery !== '' ) {
                whereQuery += ' and ';
            }
            whereQuery += ' [result].[reg_dtm] <= ' + (Number(condition.schEndDt) + 1).toString();            
        } 
       

        queryString = 'SELECT ste_cd_idx_no, pc_idx_no, proc_cd_idx_no, sch_type_data, cnt, ' +
            '   site_cd, proc_cd, pc_nm ' +
            'from ( ' +
            '   SELECT ' +
            '      [result].[ste_cd_idx_no], [result].[pc_idx_no],  ' +
            '      [result].[proc_cd_idx_no] ' ;
        if(condition.schType === 'Users'){
            queryString += '      , [result].[user_id] AS [sch_type_data] ' +
                        '      , count(\'user_id\') AS [cnt], ';
        }else{
            queryString += '      , [result].[misn_nm] AS [sch_type_data] ' +
                        '      , count(\'misn_nm\') AS [cnt], ';
         }
         
        queryString +=   '      [site].[cmn_cd] AS [site_cd], [proc].[cmn_cd] AS [proc_cd], ' +
            '      [pc].[pc_nm] ' +
            '   FROM ' +
            '      [TB_GEBTR_MISN_RESULT_M] AS [result] ' +
            '      LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [site] ON ' +
            '           [result].[ste_cd_idx_no] = [site].[idx_no] ' +
            '       LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [proc] ON ' +
            '           [result].[proc_cd_idx_no] = [proc].[idx_no] '+
            '       LEFT OUTER JOIN [TB_GEBTR_PC_M] AS [pc] ON ' +
            '          [result].[pc_idx_no] = [pc].[idx_no] ' +
            '   WHERE ' + whereQuery +
            '   GROUP BY  ' +
            '       [result].[ste_cd_idx_no], ' +
            '       [result].[pc_idx_no], ' +
            '       [site].[cmn_cd], ' +
            '       [proc].[cmn_cd], ' +
            '       [pc].[pc_nm], ' +
            '       [result].[proc_cd_idx_no], ' ;
        if(condition.schType === 'Users'){
            queryString += '       [result].[user_id] ' ;
        } else{
            queryString += '       [result].[misn_nm] ' ; 
        }
        queryString +=   ') mst ' +
            'order by ste_cd_idx_no  DESC OFFSET ' + offset +' ROWS FETCH NEXT '+limit+' ROWS ONLY '

        return sequelize.query(
            queryString
            , {row: true, type: QueryTypes.SELECT}
        );
        
    },

    retrieveById: function (condition, limit, offset) {
       
        const resultCondition = {};
        if (condition.schSteCdIdxNo) {
            resultCondition.ste_cd_idx_no = condition.schSteCdIdxNo;
        }
        if (condition.schProcCdIdxNo) {
            resultCondition.proc_cd_idx_no = condition.schProcCdIdxNo;
        }
        if (condition.schPcIdxNo) {
            resultCondition.pc_idx_no = condition.schPcIdxNo;
        }
        
        
        if (condition.schType === 'Users') {            
            resultCondition.user_id = condition.schDataVal;
        }else if (condition.schType === 'Missions'){
            resultCondition.misn_nm = condition.schDataVal;
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
        
        return ResultModel.findAndCountAll({
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
                    model: PcModel,
                    as: 'pc'
                }
            ],
            required: Object.keys(resultCondition).length !== 0,
            where: resultCondition,            
            order: [['idx_no', 'DESC']],
            limit: limit,
            offset: offset,
            distinct: true
        }) 
    }
    , retrievePcList:function(condition){
        return PcModel.findAll({
            where: {    
                ste_cd_idx_no : condition.ste_cd_idx_no,
                del_yn : 0
                } 
        })
    }

    ,retrieveByIdExcel: function (condition) {
       
        const resultCondition = {};
        if (condition.schSteCdIdxNo) {
            resultCondition.ste_cd_idx_no = condition.schSteCdIdxNo;
        }
        if (condition.schProcCdIdxNo) {
            resultCondition.proc_cd_idx_no = condition.schProcCdIdxNo;
        }
        if (condition.schPcIdxNo) {
            resultCondition.pc_idx_no = condition.schPcIdxNo;
        }
        
        
        if (condition.schType === 'Users') {            
            resultCondition.user_id = condition.schDataVal;
        }else if (condition.schType === 'Missions'){
            resultCondition.misn_nm = condition.schDataVal;
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
        
        return ResultModel.findAll({
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
                    model: PcModel,
                    as: 'pc'
                }
            ],
            required: Object.keys(resultCondition).length !== 0,
            where: resultCondition            
        })
    },
    retrieveAndCountExcel: function (condition) {
        let queryString = '';
        let whereQuery = '';
 
         if (condition.schSteCdIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[ste_cd_idx_no] = ' + condition.schSteCdIdxNo;                        
         }
         if (condition.schProcCdIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[proc_cd_idx_no] = ' + condition.schProcCdIdxNo;
         }
         if (condition.schPcIdxNo) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[pc_idx_no] = ' + condition.schPcIdxNo;
         }
 
         if (condition.schStDt && condition.schEndDt) {
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += " [result].[reg_dtm] between '" + condition.schStDt + "' and '" + (Number(condition.schEndDt) + 1).toString()  + "' ";
             
         }else if(condition.schStDt){
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[reg_dtm] >= ' + condition.schStDt || 19990101;
         }else if(condition.schEndDt){
             if(whereQuery !== '' ) {
                 whereQuery += ' and ';
             }
             whereQuery += ' [result].[reg_dtm] <= ' + (Number(condition.schEndDt) + 1).toString();            
         } 
        
 
         queryString = 'SELECT ste_cd_idx_no, pc_idx_no, proc_cd_idx_no, sch_type_data, cnt, ' +
             '   site_cd, proc_cd, pc_nm ' +
             'from ( ' +
             '   SELECT ' +
             '      [result].[ste_cd_idx_no], [result].[pc_idx_no],  ' +
             '      [result].[proc_cd_idx_no] ' ;
         if(condition.schType === 'Users'){
             queryString += '      , [result].[user_id] AS [sch_type_data] ' +
                         '      , count(\'user_id\') AS [cnt], ';
         }else{
             queryString += '      , [result].[misn_nm] AS [sch_type_data] ' +
                         '      , count(\'misn_nm\') AS [cnt], ';
          }
          
         queryString +=   '      [site].[cmn_cd] AS [site_cd], [proc].[cmn_cd] AS [proc_cd], ' +
             '      [pc].[pc_nm] ' +
             '   FROM ' +
             '      [TB_GEBTR_MISN_RESULT_M] AS [result] ' +
             '      LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [site] ON ' +
             '           [result].[ste_cd_idx_no] = [site].[idx_no] ' +
             '       LEFT OUTER JOIN [TB_GEBTR_CMN_C] AS [proc] ON ' +
             '           [result].[proc_cd_idx_no] = [proc].[idx_no] '+
             '       LEFT OUTER JOIN [TB_GEBTR_PC_M] AS [pc] ON ' +
             '          [result].[pc_idx_no] = [pc].[idx_no] ' +
             '   WHERE ' + whereQuery +
             '   GROUP BY  ' +
             '       [result].[ste_cd_idx_no], ' +
             '       [result].[pc_idx_no], ' +
             '       [site].[cmn_cd], ' +
             '       [proc].[cmn_cd], ' +
             '       [pc].[pc_nm], ' +
             '       [result].[proc_cd_idx_no], ' ;
         if(condition.schType === 'Users'){
             queryString += '       [result].[user_id] ' ;
         } else{
             queryString += '       [result].[misn_nm] ' ; 
         }
         queryString +=   ') mst ' ;
 
         return sequelize.query(
             queryString
             , {row: true, type: QueryTypes.SELECT}
         );
         
     }

}

module.exports = resultService
