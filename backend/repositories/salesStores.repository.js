const { getPool } = require("../db/pool");
const { sql } = require("../db/connection.js");

async function listStores() {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT TOP 10 * FROM PRODUTOS');
        return result.recordset;
    } catch (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
}

async function streamStores({onRow, onEnd, onError}) {
    const pool = await getPool();
    const request = pool.request();
    request.stream = true;
    request.query('SELECT * FROM PRODUTOS');
    request.on('row', row=>{
        onRow(row);
    });
    request.on('error', err=>{
        console.error("Error streaming stores:", err);
        onError(err);
    });
    request.on('done', ()=>{
        onEnd();
    });
}

async function getStoreById(id) {
    console.log("Fetching store with ID:", id);
    try {
        if (isNaN( parseInt(id))) {
            throw new Error(`Invalid store ID: ${id}`);
        }
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Sales.Store WHERE BusinessEntityID = @id');
        return result.recordset[0];
    } catch (error) {
        console.error(`Error fetching store with ID ${id}:`, error);
        throw error;
    }
}

module.exports = {
    listStores,
    streamStores,
    getStoreById
};