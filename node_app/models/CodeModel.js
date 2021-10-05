const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const GroupCodeModel = require('./GroupCodeModel');
const ProcessModel = requier('./ProcessModel');
const ProcessSegmentModel = require("./ProcessSegmentModel");

class CodeModel extends Model {

}

CodeModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gr_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cmn_cd: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    cmn_cd_nm: {
        type: DataTypes.STRING(50)
    },
    use_yn: {
        type: DataTypes.BOOLEAN
    },
    pcsgid: {
        type: DataTypes.STRING(200),
        allowNull : true
    },
    procid: {
        type: DataTypes.STRING(200),
        allowNull : true
    }

}, {
    sequelize,
    modelName: 'code',
    tableName: 'TB_GEBTR_CMN_C',
    underscored: true
})
/
CodeModel.belongsTo(GroupCodeModel, {
    foreignKey: 'gr_idx_no',
    targetKey: 'idx_no'
})

CodeModel.belongsTo(ProcessModel, {
    foreignKey: 'procid',
    targetKey: 'procid'
})

CodeModel.belongsTo(GroupCodeModel, {
    foreignKey: 'pcsgid',
    targetKey: 'pcsgid'
})

module.exports = CodeModel;
