const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const GroupCodeModel = require('./GroupCodeModel');

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

module.exports = CodeModel;
