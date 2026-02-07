const sql = require("mssql");
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    //server: process.env.DB_SERVER,
    server: process.env.DB_HOST_PUBLIC,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: Number(process.env.DB_POOL_MAX), 
        min: Number(process.env.DB_POOL_MIN), 
        idleTimeoutMillis: Number(process.env.IDLE_TIMEOUT) 
    }
};

module.exports = {
    sql,
    dbConfig
};