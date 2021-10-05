const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');

class IfLogModel extends Model {

}

IfLogModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    if_nm: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    log_ctn: {
        type: DataTypes.STRING(400),
        allowNull: false
    },
    rtn_data: {
        type: DataTypes.STRING(200),
        allowNull: true
    },     
    reg_dtm: {
        type: DataTypes.STRING(30),
        allowNull: true
    }


}, {
    sequelize,
    modelName: 'ifLog',
    tableName: 'TB_GEBTR_IF_L',
    underscored: true
})

module.exports = IfLogModel;
