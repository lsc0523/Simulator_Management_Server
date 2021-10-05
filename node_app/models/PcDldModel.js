const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const ProgramModel = require('./ProgramModel');
const PcModel = require('./PcModel');

class PcDldModel extends Model {

}

PcDldModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pc_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rels_pgm_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    rels_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    dld_pgm_idx_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    dld_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'pc',
    tableName: 'TB_GEBTR_PC_DLD_L',
    underscored: true
})

PcDldModel.belongsTo(PcModel, {
    foreignKey: 'pc_idx_no',
    targetKey: 'idx_no'
})
,
PcDldModel.belongsTo(ProgramModel, {
    foreignKey: 'rels_pgm_idx_no',
    targetKey: 'idx_no'
})
,
PcDldModel.belongsTo(ProgramModel, {
    foreignKey: 'dld_pgm_idx_no',
    targetKey: 'idx_no'
})
module.exports = PcDldModel;
