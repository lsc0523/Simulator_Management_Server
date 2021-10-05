const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');

class GroupCodeModel extends Model {

}

GroupCodeModel.init({
    idx_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gr_cd: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    gr_cd_nm: {
        type: DataTypes.STRING(50)
    },
    use_yn: {
        type: DataTypes.BOOLEAN
    }

}, {
    sequelize,
    modelName: 'groupcode',
    tableName: 'TB_GEBTR_GR_C',
    underscored: true
})

module.exports = GroupCodeModel;
