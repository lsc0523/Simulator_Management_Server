const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');

class MisnResultModel extends Model {

}

MisnResultModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ste_cd: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    pc_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    proc_cd: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    misn_nm: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    etc1: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc2: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc3: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc4: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc5: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc6: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc7: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc8: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc9: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc10: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    
    rgst_id: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    reg_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'misnResult',
    tableName: 'TB_GEBTR_MISN_RESULT_M',
    underscored: true
})
/*
NoticeModel.belongsTo(UserModel, {
    foreignKey: 'author_id',
    targetKey: 'id',
    as: 'author'
})

NoticeModel.belongsTo(CodeModel, {
    foreignKey: 'type_id',
    targetKey: 'id',
    as: 'type'
})*/
module.exports = MisnResultModel;
