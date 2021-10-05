const UserLogModel = require('../models/UserLogModel');
const { Op } = require('sequelize');
const { Sequelize } = require('../models/connection');

const userLogService = {

    retrieveAll: function () {
        return UserLogModel.findAll({
            
            order: [['idx_no', 'DESC']]
        })
    },
    retrieveAndCount: function (schStDt,schEndDt, limit, offset) {
        
        return UserLogModel.findAndCountAll({
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
    create: function ({ log_ctn, rgst_id }) {
        return UserLogModel.create({
            log_ctn : log_ctn, 
            rgst_id : rgst_id

        })
    },

}

module.exports = userLogService
