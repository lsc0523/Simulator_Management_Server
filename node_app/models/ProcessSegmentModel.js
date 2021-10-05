const sequelize = require('./connection');
const { Model, Datatypes } = require('sequelize');

class ProcessSegmentModel extends Model {

}

ProcessSegmentModel.init({
    pcsgid: {
        type :  Datatypes.STRING(200),
        primaryKey : true,
        allowNull : false
    },
    pcsgname: {
        type : Datatypes.STRING(4000),
        allowful : false
    }
},{
    sequelize,
    modelname: 'process',
    tableName: 'TB_MMD_PROCESS',
})

module.exports = ProcessSegmentModel;