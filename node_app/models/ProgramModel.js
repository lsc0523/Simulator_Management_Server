const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');
const ProcessModel = require('./ProcessModel');
const ProcessSegmentModel = require('./ProcessSegmentModel');

class ProgramModel extends Model {

}

ProgramModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    proc_cd_idx_no: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ste_cd_idx_no: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    rels_way: {
        type: DataTypes.BOOLEAN
    },
    upld_file_nm: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    upld_file_path: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    upld_file_capa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ver_nm: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    pgsc_file_nm: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    pgsc_file_path: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    pgsc_file_capa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    memo_ctn: {
        type: DataTypes.STRING(500),
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
    ste_rels_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    pcsgid: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    procid: {
        type: DataTypes.STRING(200),
        allowNull : true
    }
}, {
    sequelize,
    modelName: 'program',
    tableName: 'TB_GEBTR_PGM_M',
    underscored: true
})

ProgramModel.belongsTo(CodeModel, {
    foreignKey: 'ste_cd_idx_no',
    targetKey: 'idx_no',
    as: 'site'
})
ProgramModel.belongsTo(CodeModel, {
    foreignKey: 'proc_cd_idx_no',
    targetKey: 'idx_no',
    as: 'proc'
})
ProgramModel.belongsTo(ProcessModel, {
    foreignKey: 'procid',
    targetKey: 'procid',
    as: 'process'
})
ProgramModel.belongsTo(ProcessSegmentModel, {
    foreignKey: 'pcsgid',
    targetKey: 'pcsgid',
    as: 'processsegment'
})
module.exports = ProgramModel;
