const levarEReceberRepository = require('../repositories/levarReceber.repository');

async function listarLevarReceber(orderBy, direction) {
  return await levarEReceberRepository.listarLevarEReceber(orderBy, direction);
} 

async function onStreamLevarReceber( {sendChunk, sendEnd, sendError}, orderBy, direction) {
  await levarEReceberRepository.listarLevarEReceberStream(
    orderBy, direction,{
    onRow: (row)=> sendChunk(row),
    onEnd: ()=> sendEnd(),
    onError: (err)=> sendError(err)
  });
}

async function levarReceberPorVendedor(vendedorLogin, orderBy, direction) {
   if(!vendedorLogin) throw new Error("Vendedor login é Obrigatório");
  try {
    const vendas = await levarEReceberRepository.levarEReceberPorVendedor(vendedorLogin, orderBy, direction);
    if(!vendas || vendas.length === 0) throw new Error(`Nenhuma venda encontrada para o vendedor ${vendedorLogin}`);
    return vendas;
  } catch (err) {
    console.error(`Erro ao buscar levar e receber por vendedor ${vendedorLogin}:`, err);
    throw err;
  }
}
  
module.exports = {
    listarLevarReceber,
    onStreamLevarReceber,
    levarReceberPorVendedor
}