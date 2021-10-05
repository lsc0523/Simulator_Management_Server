const sequelize = require('./connection');
const { Model, Datatypes } = require('sequelize');

class ProcessModel extends Model {

}

ProcessModel.init({
    procid: {
        type :  Datatypes.STRING(200),
        primaryKey : true,
        allowNull : false
    },
    procname: {
        type : Datatypes.STRING(4000),
        allowful : false
    }
},{
    sequelize,
    modelname: 'process',
    tableName: 'TB_MMD_PROCESS',
})

module.exports = ProcessModel;