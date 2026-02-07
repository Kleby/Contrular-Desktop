const { getPool } = require('./pool');

/**
 * Testa se o banco responde
 */
async function healthCheck() {
    try {
        const pool =  await getPool();
        await pool.request().query('SELECT 1');        
        return { statusCode: "200", database: process.env.DB_DATABASE || "unknown" , timestamp: new Date().toLocaleString()}; 
    } catch (error) {
        return { statusCode: "500", error };  
    }
}
module.exports = {
    healthCheck
};