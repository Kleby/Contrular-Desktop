const { getPool, closePool } = require('./pool');

/**
 * Testa se o banco responde
 */
async function healthCheck() {
    try {
        const pool =  await getPool();
        await pool.request().query('SELECT 1');  
        console.log({ statusCode: "200", database: process.env.DB_DATABASE || "unknown" , timestamp: new Date().toLocaleString()});
        return { statusCode: "200", database: process.env.DB_DATABASE || "unknown" , timestamp: new Date().toLocaleString()}; 
    } catch (error) {
        await closePool();
        return { statusCode: "500", error };  
    }
}


// healthCheck();

module.exports = {
    healthCheck
};