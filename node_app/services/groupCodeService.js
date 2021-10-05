const GroupCodeModel = require('../models/GroupCodeModel');

const groupCodeService = {

    retrieveAll: function () {
        return GroupCodeModel.findAll({
            order: [['idx_no', 'DESC']]
        })
    },

    retrieveAndCount: function ({ limit, offset }) {
        return GroupCodeModel.findAndCountAll({
            order: [['idx_no', 'DESC']],
            limit: limit,
            offset: offset,
            distinct: true
        })
    },

    retrieveById: function (id) {
        return GroupCodeModel.findOne({
            where: {
                id: id
            }
        })
    },

    create: function (data) {
        return GroupCodeModel.create({
            groupcode: data.groupcode,
            name: data.name,
            is_enabled: data.is_enabled,
            ref1: data.ref1,
            ref2: data.ref2,
            ref3: data.ref3
        })
    },

    update: function (id, data) {
        return GroupCodeModel.update({
            name: data.name,
            is_enabled: data.is_enabled,
            ref1: data.ref1,
            ref2: data.ref2,
            ref3: data.ref3
        }, {
            where: {
                id: id
            }
        })
    },

    delete: function (id) {
        return GroupCodeModel.destroy({
            where: {
                id: id
            }
        })
    }

}

module.exports = groupCodeService
