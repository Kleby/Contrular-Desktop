const salesStoreRepository = require("../repositories/salesStores.repository.js");

async function listStores() {
    return await salesStoreRepository.listStores();
}  

async function listStoresOnStream({sendChunk, sendEnd, sendError}) {
     await salesStoreRepository.streamStores({
        onRow: (row)=>{
            sendChunk({
                id: row.PRO_CODIGO,
                name: row.PRO_DESCRI,
                //salesID: row.SalesPersonID
            });
        },
        onEnd: ()=> sendEnd(),
        onError: (err)=> sendError(err)
    }); 
}

async function getStoreById(id) {
    if(!id) throw new Error("ID is required");
    try {
        const store = await salesStoreRepository.getStoreById(id);
        if(!store) throw new Error(`Store with ID ${id} not found`);
        return store;
    
    } catch (error) {
        console.error(`Error in getStoreById with ID ${id}:`, error);
        throw error;
    }
}

module.exports = {
    listStores,
    listStoresOnStream,
    getStoreById
};