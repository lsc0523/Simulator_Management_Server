const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');

class PcModel extends Model {

}

PcModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pc_nm: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    pc_ip: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    ste_cd_idx_no: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    loc_desc: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    del_yn: {
        type: DataTypes.BOOLEAN
    },   
    rgst_nm: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    reg_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    },    
    upus_nm: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    upd_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    }


}, {
    sequelize,
    modelName: 'pc',
    tableName: 'TB_GEBTR_PC_M',
    underscored: true
})

PcModel.belongsTo(CodeModel, {
    foreignKey: 'ste_cd_idx_no',
    targetKey: 'idx_no'
})

module.exports = PcModel;
