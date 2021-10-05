const  {Sequelize}  = require('sequelize');
const config = require('../config');

/*
const connection = (function () {

    const seq = new Sequelize(

        config.db_config.database,
        config.db_config.user,
        config.db_config.password,
        {
            host: config.db_config.host,
            dialect: 'mysql',
            logging: false
        })


    seq.authenticate()
        .then(() => {
            console.log("Connected to MySQL server")
            seq.sync()
        })
        .catch((e) => {
            console.error("Failed to connect to MySQL server >> ", e)
        })

    return seq

})()

*/


const connection = (function () {

    const seq = new Sequelize(
    config.db_config.database,
    config.db_config.user,
    config.db_config.password,
    { 
        host: config.db_config.host, 
        port: config.db_config.PORT || "1433", 
        dialect: "mssql", 
        dialectOptions: {
             options: { 
                 useUTC: false, 
                 dateFirst: 1, 
                 encrypt: false, // 오류 발생시 추가 한 부분! 
            }, 
        }, 
        pool: { 
            max: 5, 
            min: 0,
            acquire: 30000, 
            idle: 10000, 
        }, 
        define: { 
            // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created. 
            // This was true by default, but now is false by default 
            timestamps: false, 
            supportBigNumbers: true, 
        }, 
    })
    seq.authenticate()
    .then(() => {
        console.log("Connected to MsSQL server")
        seq.sync()
    })
    .catch((e) => {
        console.error("Failed to connect to MsSQL server >> ", e)
    })

return seq

})()



module.exports = connection;
