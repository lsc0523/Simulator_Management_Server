const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');
const PcModel = require('../models/PcModel');

class ResultModel extends Model {

}

ResultModel.init({
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
    pc_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    proc_cd_idx_no: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(50),
        allowNull: false
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
    etc11: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc12: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc13: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc14: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    etc15: {
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
    modelName: 'result',
    tableName: 'TB_GEBTR_MISN_RESULT_M',
    underscored: true
})

ResultModel.belongsTo(CodeModel, {
    foreignKey: 'ste_cd_idx_no',
    targetKey: 'idx_no',
    as: 'site'
})
ResultModel.belongsTo(CodeModel, {
    foreignKey: 'proc_cd_idx_no',
    targetKey: 'idx_no',
    as: 'proc'
})
ResultModel.belongsTo(PcModel, {
    foreignKey: 'pc_idx_no',
    targetKey: 'idx_no',
    as: 'pc'
})
module.exports = ResultModel;
