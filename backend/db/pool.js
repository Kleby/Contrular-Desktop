const { sql, dbConfig } = require( './connection.js');

let pool;

async function getPool() {
    if(pool) return pool;
    try {
        pool = await sql.connect(dbConfig);
        pool.on("error", err=>{ 
            console.error("SQL Pool Error", err);
            pool = null;
        });

        console.log("SQL Pool created and connected.");        
        return pool;
    } catch (err) {
        console.error("Error creating SQL Pool", err);
        throw err;
    }
}

async function closePool() {
    if(pool) {
        await pool.close();
        pool = null;
        console.log("🔌 SQL Pool closed.");
    }
}

module.exports = {
    getPool,
    closePool
};