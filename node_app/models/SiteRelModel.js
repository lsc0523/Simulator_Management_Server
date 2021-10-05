const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');

class SiteRelModel extends Model {

}

SiteRelModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ste_cd_idx_no: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rels_tm: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    reg_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    upd_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'siteRel',
    tableName: 'TB_GEBTR_STE_RELS_M',
    underscored: true
})

SiteRelModel.belongsTo(CodeModel, {
    foreignKey: 'ste_cd_idx_no',
    targetKey: 'idx_no'
})
module.exports = SiteRelModel;
