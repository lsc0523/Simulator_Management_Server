const IfLogModel = require('../models/IfLogModel');

const { Op } = require('sequelize');
const { Sequelize } = require('../models/connection');

const ifService = {

    retrieveAndCount: function (schStDt,schEndDt, limit, offset) {
        
        return IfLogModel.findAndCountAll({
            where: {
                reg_dtm: {
                    [Op.gte]: schStDt || 19900101
                },
                reg_dtm: schEndDt ?
                    {
                        [Op.lte]: (Number(schEndDt) + 1).toString()
                    } :
                    {
                        [Op.not]: null
                    }
            },
            order: [['idx_no', 'DESC']],
            limit: limit,
            offset: offset,
            distinct: true
        })
    },
    create: function ({ if_nm, log_ctn, rtn_data}) {
        return IfLogModel.create({
            if_nm : if_nm,
            log_ctn : log_ctn, 
            rtn_data : rtn_data

        })
    },
}

module.exports = ifService
