const CodeModel = require('../models/CodeModel');
const GroupCodeModel = require('../models/GroupCodeModel');
const PcModel = require('../models/PcModel');
const ProgramModel = require('../models/ProgramModel');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../models/connection');


const dashboardService = {

    retrieveAll: function () {
        return sequelize.query(
            'select mst.proc_cd, mst.ESWA, mst.ESNA, mst.ESNB, mst.ESMI, mst.OC, first_tb.ver_nm as new_ver ' +
            'from ' +
            '( ' +
            '    select * ' + 
            '    from ( ' +
            '        select pgm.PROC_CD_IDX_NO, proc_tb.CMN_CD_NM  as PROC_CD , site_tb.CMN_CD as SITE_CD ' +
            '           , concat(pgm.ver_nm ,\' (\', (select count(DISTINCT pc_idx_no ) from TB_GEBTR_PC_DLD_L tgpdl where rels_pgm_idx_no = pgm.idx_no ), \')\') as ver_nm ' +
            '        from TB_GEBTR_PGM_M as pgm ' +
            '            left outer join TB_GEBTR_CMN_C as proc_tb ' +
            '            on pgm.PROC_CD_IDX_NO  = proc_tb.IDX_NO ' +
            '            left outer join  TB_GEBTR_CMN_C as site_tb ' +
            '            on pgm.STE_CD_IDX_NO  = site_tb.IDX_NO ' +
            '        where pgm.idx_no  in ' +
            '            ( ' +
            '            select max(IDX_NO) as idx_no  from TB_GEBTR_PGM_M ' +
            '           group by PROC_CD_IDX_NO, STE_CD_IDX_NO ' +
            '            ) ' +
            '        ) as rst  ' +
            '    pivot(max(ver_nm)  for SITE_CD in ([ESWA], [ESNA], [ESNB], [ESMI], [OC]) ) as pivot_rst ' +
            ') as mst ' +
            'left outer join (select  PROC_CD_IDX_NO ,ver_nm ' +	
            '            from TB_GEBTR_PGM_M as pgm ' +
            '            where idx_no  in ' +
            '                ( ' +
            '                select max(IDX_NO) as idx_no  from TB_GEBTR_PGM_M ' +
            '                group by PROC_CD_IDX_NO ' +
            '                ) ) as first_tb ' +
            '               on mst.proc_cd_idx_no = first_tb.proc_cd_idx_no ' 
            , {raw: true, type: QueryTypes.SELECT}
        );
        
    },
    retrieveSite: function (id) {

        return sequelize.query(
            'SELECT  [proc].idx_no, [proc].cmn_cd, [proc].cmn_cd_nm, program.ver_nm , program.ste_rels_dtm ' +
            'FROM TB_GEBTR_PGM_M as program ' +
            '    LEFT OUTER JOIN TB_GEBTR_CMN_C AS [proc] ' +
            '       ON program.proc_cd_idx_no = [proc].idx_no AND [proc].use_yn = 1 ' +
            'WHERE program.ste_cd_idx_no=' + id + ' AND program.idx_no in (	' + 
            '        select max(idx_no) as idx_no from TB_GEBTR_PGM_M where ste_cd_idx_no='+id+' and ste_rels_dtm is not null group by proc_cd_idx_no )'
            , {raw: true, type: QueryTypes.SELECT});
    },


    retrievePcList: function (id) {
      
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
            where: {
                ste_cd_idx_no : id,
                del_yn : 0
            },
            order: [['idx_no', 'DESC']],            
            distinct: true
        })
    },

    retrieveProgram: function (site_id, process_id) {
        return sequelize.query(
        'SELECT DLD.IDX_NO, DLD.PC_IDX_NO, DLD.RELS_PGM_IDX_NO, PGM.idx_no AS pgm_idx_no, PGM.VER_NM, PC.PC_NM, PC_IP ' +
        'FROM (select max(idx_no) as idx_no, pc_idx_no, max(RELS_PGM_IDX_NO) as RELS_PGM_IDX_NO ' +
        '      from TB_GEBTR_PC_DLD_L tgpdl group by pc_idx_no) AS DLD ' +
        '    LEFT OUTER JOIN ( '+
        '       SELECT IDX_NO, VER_NM ' +
        '       FROM  TB_GEBTR_PGM_M ' +
        '       WHERE STE_CD_IDX_NO = ' + site_id +
        '           AND PROC_CD_IDX_NO = ' + process_id +
        '           AND STE_RELS_DTM IS NOT NULL' + 
        '        ) AS PGM ' +
        '    ON DLD.RELS_PGM_IDX_NO = PGM.idx_no ' +	
        '    RIGHT OUTER JOIN  ( ' +
        '       SELECT IDX_NO, PC_NM, PC_IP ' +
        '       FROM TB_GEBTR_PC_M ' +
        '       WHERE STE_CD_IDX_NO = ' + site_id + 
        '           AND DEL_YN = 0 ) as PC ' +
        '    ON DLD.PC_IDX_NO = PC.idx_no '
        , {raw: true, type: QueryTypes.SELECT} )
    },

    retrieveProgramNewVer: function (site_id, process_id) {
        return sequelize.query(
        'SELECT top(1) ver_nm ' +
        'FROM  TB_GEBTR_PGM_M ' +
        'WHERE STE_CD_IDX_NO = ' + site_id + 
        '    AND PROC_CD_IDX_NO = ' + process_id +
        '    AND STE_RELS_DTM IS NOT NULL' + 
        ' ORDER by idx_no desc '
        , {raw: true, plain: true, type: QueryTypes.SELECT} )
    },

    retrievePc: function (id) {
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

    retrievePcVerList: function (pcIdxNo){
        return sequelize.query(
            'SELECT top(1) iif(ins_pgm.cmn_cd is null , dwn_pgm.cmn_cd , ins_pgm.cmn_cd) as proc_cd' +
            ' , ins_pgm.ver_nm as ins_pgm_ver, ins_pgm.ver_nm as ins_new_ver, pcDld.RELS_DTM ' + 
            ' , dwn_pgm.ver_nm as dwn_pgm_ver, dwn_pgm.ver_nm as dwn_new_ver, pcDld.DLD_DTM ' +
            'FROM TB_GEBTR_PC_DLD_L as pcDld  ' +
            '    LEFT OUTER JOIN ' +
            '        (SELECT code.CMN_CD, pgm.idx_no, pgm.ver_nm from TB_GEBTR_PGM_M as pgm ' +
            '            LEFT OUTER JOIN tb_gebtr_cmn_c as code on  pgm.PROC_CD_IDX_NO  = code.idx_no ' +
            '            LEFT OUTER JOIN ( ' +
            '               SELECT  PROC_CD_IDX_NO ,ver_nm ' +
            '               FROM TB_GEBTR_PGM_M as pgm ' +
            '               WHERE idx_no  in ( ' +
            '                   SELECT max(IDX_NO) as idx_no  FROM TB_GEBTR_PGM_M ' +
            '                   GROUP BY PROC_CD_IDX_NO ' +
            '                  ) ) as first_tb ' +
            '               ON pgm.proc_cd_idx_no = first_tb.proc_cd_idx_no ' +
            '            )AS ins_pgm ' +
            '    on pcDld.RELS_PGM_IDX_NO  = ins_pgm.IDX_NO ' +
            '    LEFT OUTER JOIN ' +
            '        (select code.CMN_CD, pgm.idx_no, pgm.ver_nm from TB_GEBTR_PGM_M as pgm ' +
            '            left outer join tb_gebtr_cmn_c as code on  pgm.PROC_CD_IDX_NO  = code.idx_no ' +
            '            left outer join ( ' +
            '               select  PROC_CD_IDX_NO ,ver_nm	' +
            '               from TB_GEBTR_PGM_M as pgm ' +
            '               where idx_no  in ( ' +
            '                   select max(IDX_NO) as idx_no  from TB_GEBTR_PGM_M ' +
            '                   group by PROC_CD_IDX_NO ' +
            '                  ) ) as first_tb ' +
            '              on pgm.proc_cd_idx_no = first_tb.proc_cd_idx_no ' +
            '            )AS dwn_pgm ' +
            '    on pcDld.DLD_PGM_IDX_NO  = dwn_pgm.IDX_NO ' +
            'WHERE pcDld.pc_idx_no = ' + pcIdxNo + ' order by pcDld.IDX_NO  desc'
            , {raw: true, type: QueryTypes.SELECT});
    }

}

module.exports = dashboardService
