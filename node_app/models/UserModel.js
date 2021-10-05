const sequelize = require('./connection');
const { Model, DataTypes } = require('sequelize');
const CodeModel = require('./CodeModel');

class UserModel extends Model {

}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(128),
        unique: true
    },
    language_id: {
        type: DataTypes.INTEGER
    },
    region_id: {
        type: DataTypes.INTEGER
    },
    type: {
        type: DataTypes.STRING(32),
    },
    name: {
        type: DataTypes.STRING(64),
    },
    device_id: {
        type: DataTypes.STRING(128),
        // unique: true
    },
    hash: {
        type: DataTypes.STRING(256)
    },
    salt: {
        type: DataTypes.STRING(256)
    },
    is_enabled: {
        type: DataTypes.BOOLEAN
    },
    login_at: {
        type: DataTypes.DATE
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }

}, {
    sequelize,
    modelName: 'user',
    tableName: 'tb_user',
    timestamps: true,
    underscored: true,
    paranoid: true
})
/*
UserModel.belongsTo(CodeModel, {
    foreignKey: 'language_id',
    targetKey: 'id',
    as: 'language'
})

UserModel.belongsTo(CodeModel, {
    foreignKey: 'region_id',
    targetKey: 'id',
    as: 'region'
})
*/
module.exports = UserModel;
