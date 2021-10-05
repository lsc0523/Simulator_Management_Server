const UserModel = require('../models/UserModel');
const CodeModel = require('../models/CodeModel');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../models/connection');
const userService = {

    retrieveUsers: function (empNo) {
        return sequelize.query(
            "SELECT TOP 1"+
            "   substring(left(BAS_ATTR33 , charindex('|',BAS_ATTR33)-1), charindex('\\',  left(BAS_ATTR33 , charindex('|',BAS_ATTR33)-1))+1 ,                              "+
            "       len(left(BAS_ATTR33 , charindex('|',BAS_ATTR33)-1)) - charindex('\',  left(BAS_ATTR33 , charindex('|',BAS_ATTR33)-1)) ) as grade,                       "+
            "   (select cd.CMN_CD from TB_GEBTR_AUTH_M auth INNER JOIN TB_GEBTR_CMN_C AS cd ON auth.AUTH_CD_IDX_NO = cd.IDX_NO where auth.EMP_NO = M.BAS_ATTR31) as auth,   "+
            "   substring(left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1), charindex('\\',  left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1))+1 , "+
            "       len(left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1)) - charindex('\\',  left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1)) ) as name, "+
            "   (select TOP 1 substring(left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1), charindex('\\',  left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1))+1 , "+
            "       len(left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1)) - charindex('\\',  left(BAS_ATTR1 , charindex('|',BAS_ATTR1)-1)) ) "+
            "   from IFR_MMD_BAS_ITEM_DATA where SRC_BAS_ITEM_ID = 'DEPARTMENT' and BAS_KEY_ATTR1 = M.BAS_ATTR8) AS team "+
            "FROM  IFR_MMD_BAS_ITEM_DATA M "+
            "WHERE SRC_BAS_ITEM_ID = 'PERSON' and BAS_ATTR31 = '"+empNo+"'"
            , {raw: true, type: QueryTypes.SELECT} )
    },

    retrieveAndCount: function (resultCondition, limit, offset) {
        
        const condition = {};
        const or_condition = {};
        
        if (resultCondition.nick) {
            condition.name = {[Op.like]: `%${resultCondition.nick}%`} ;
        }
        if (resultCondition.user_id) {
         or_condition.user_id = resultCondition.user_id;
        }else{
            or_condition.user_id = '';
        }
        if (resultCondition.local) {
            condition.region_id = resultCondition.local;
        }

        return UserModel.findAndCountAll({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    as: 'language'
                },
                {
                    model: CodeModel,
                    required: true,
                    as: 'region'
                }
            ],
            order: [['id', 'DESC']],

            where :{
            [Op.and] : [
                condition,
                {
                    type:resultCondition.userType,
                    [Op.or]: [
                        { email: {[Op.like]: `%${or_condition.user_id}%`} },
                        { device_id: {[Op.like]: `%${or_condition.user_id}%`} }
                        ]
                }
                ]
            },
 
            limit: limit,
            offset: offset,
            distinct: true
        })
    },

    retrieveById: function (id) {
        return UserModel.findOne({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    as: 'language'
                },
                {
                    model: CodeModel,
                    required: true,
                    as: 'region'
                }
            ],
            where: {
                id: id
            }
        })
    },

    retrieveUsersByType: function (type) {
        return UserModel.findAll({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    as: 'language'
                },
                {
                    model: CodeModel,
                    required: true,
                    as: 'region'
                }
            ],
            where: {
                type: type
            },
            order: [['id', 'DESC']]
        })
    },


    retrieveUserByEmail: function (email) {
        return UserModel.findOne({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    as: 'language'
                },
                {
                    model: CodeModel,
                    required: true,
                    as: 'region'
                }
            ],
            where: {
                email: email
            }
        });
    },

    retrieveUserByUid: function (uid) {
        return UserModel.findOne({
            include: [
                {
                    model: CodeModel,
                    required: true,
                    as: 'language'
                },
                {
                    model: CodeModel,
                    required: true,
                    as: 'region'
                }
            ],
            where: {
                [Op.or]: [
                    { email: uid },
                    { device_id: uid }
                ]
            }
        });
    },

    createManager: function (userData) {
        return UserModel.create({
            language_id: userData.language_id,
            region_id: userData.region_id,
            type: userData.type,
            name: userData.name,
            status: userData.status,
            email: userData.email,
            hash: userData.hash,
            salt: userData.salt,
            is_enabled: userData.is_enabled
        })
    },

    createOperatorDevice: function (userData) {
        return UserModel.create({
            language_id: userData.language_id,
            region_id: userData.region_id,
            type: userData.type,
            name: userData.name,
            status: userData.status,
            device_id: userData.device_id,
            is_enabled: userData.is_enabled
        })
    },

    update: function (id, data) {
        return UserModel.update({
            language_id: data.language_id,
            region_id: data.region_id,
            name: data.name,
            hash: data.hash,
            salt: data.salt,
            is_enabled: data.is_enabled
        }, {
            where: {
                id: id
            }
        })
    },

    delete: function (id) {
        return UserModel.destroy({
            where: {
                id: id
            }
        })
    }
}

module.exports = userService
