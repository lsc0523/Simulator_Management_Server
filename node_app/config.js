//Server Constants

try {
    var db_config = {
        host     : process.env.DB_HOST, // '127.0.0.1'
        port     : process.env.DB_PORT,
        user     : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE,
        connectionLimit: process.env.DB_CONNECTION_LIMIT,
        waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS // false
    };
    exports.db_config = db_config;
} catch(e) { console.error('failed when connecting to mssql ' + e.description); }
