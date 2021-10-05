const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');

class UserLogModel extends Model {

}

UserLogModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    log_ctn: {
        type: DataTypes.STRING(200),
        allowNull: false
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
    modelName: 'userLog',
    tableName: 'TB_GEBTR_USER_L',
    underscored: true
})

module.exports = UserLogModel;
