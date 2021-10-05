const CodeModel = require('../models/CodeModel');
const UserAuthModel = require('../models/UserAuthModel');
const { sequelize } = require('../models/GroupCodeModel');
const GroupCodeModel = require('../models/GroupCodeModel');
const { QueryTypes } = require('sequelize');
const moment = require('moment');

const userAuthService = {

    retrieveAll: function () {
        return UserAuthModel.findAll({
            include: [
                {
                    model: CodeModel,
                    required: true
                }
            ],
            order: [['idx_no', 'DESC']]
        })
    },

    retrieveAndCount: function (condition, limit, offset) {
        const resultCondition = {};

        console.log("authService>>", condition);
         
        if(condition.srchAuth){
            console.log("userAuth Und>>", condition.srchAuth);
            resultCondition.auth_cd_idx_no = condition.srchAuth;
        }

        if(condition.srchEmpNm){
            resultCondition.emp_nm = condition.srchEmpNm;
        } 

        if(condition.srchId){
            resultCondition.user_id = condition.srchId;
        }

        return UserAuthModel.findAndCountAll({
            include: [
                {
                    model: CodeModel,
                    as: 'auth'
                    
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


    create: function ({ auth_cd_idx_no, user_id, emp_no, emp_nm, org_nm, rgst_nm }) {
        return UserAuthModel.create({
            auth_cd_idx_no : auth_cd_idx_no, 
            user_id : user_id, 
            emp_no : emp_no, 
            emp_nm : emp_nm, 
            org_nm : org_nm,
            rgst_nm : rgst_nm,
            reg_dtm : moment().format('YYYY-MM-DD HH:mm:ss')
        })
    },

    update: function (id, { auth_cd_idx_no, upus_nm }) {
        return UserAuthModel.update({
            auth_cd_idx_no : auth_cd_idx_no,
            upus_nm: upus_nm,
            upd_dtm: moment().format('YYYY-MM-DD HH:mm:ss') 
        }, {
            where: {
                idx_no: id
            }
        })
    }, 

    retrieveId: function(id) {
        return sequelize.query(  
            `SELECT TOP 1 A.emp_no, A.emp_nm
            , (SELECT SIMULATOR.dbo.UF_NAME_BY_LANGUAGE(BAS_ATTR1,'ko-KR') FROM SIMULATOR.dbo.IFR_MMD_BAS_ITEM_DATA Z WITH (NOLOCK) WHERE Z.SRC_BAS_ITEM_ID = 'DEPARTMENT' AND Z.BAS_KEY_ATTR1 = A.BAS_ATTR8 GROUP BY BAS_KEY_ATTR1, BAS_ATTR1) AS org_nm
            , (SELECT COUNT(*) FROM TB_GEBTR_AUTH_M WITH (NOLOCK) WHERE [user_id] = '` + id + `') as insId
            FROM (SELECT IF_RCV_DATE
                    , BAS_ATTR31 AS emp_no
                    , SIMULATOR.dbo.UF_NAME_BY_LANGUAGE(BAS_ATTR1,'ko-KR') AS emp_nm
                    , BAS_ATTR8
                 FROM SIMULATOR.dbo.IFR_MMD_BAS_ITEM_DATA WITH (NOLOCK)
                WHERE SRC_BAS_ITEM_ID = 'PERSON'
                  AND BAS_KEY_ATTR1 = '` + id + `') A
            ORDER BY IF_RCV_DATE DESC`
            , {raw: true, type: QueryTypes.SELECT} 
        );
    },

    retrieveIdChk:   function({user_id}){
        return UserAuthModel.findOne({
            where:{
                user_id: user_id
            }
        })
    },
 
}

module.exports = userAuthService
