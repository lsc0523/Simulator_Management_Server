const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');

class UserAuthModel extends Model {

}

UserAuthModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    auth_cd_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    emp_no: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    emp_nm: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    org_nm: {
        type: DataTypes.STRING(100),
        allowNull: true
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
    modelName: 'userAuth',
    tableName: 'TB_GEBTR_AUTH_M',
    underscored: true
})

UserAuthModel.belongsTo(CodeModel, {
    foreignKey: 'auth_cd_idx_no',
    targetKey: 'idx_no',
    as:'auth'
})

module.exports = UserAuthModel;
