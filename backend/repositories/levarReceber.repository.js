const {getPool} = require("../db/pool.js");
const { sql } = require("../db/connection.js");

async function listarLevarEReceber(){
    try {
        const pool = await getPool(orderBy="CRD.CRD_ATRASO", direction="DESC");
        const query = `
            SELECT 
                V.VEN_CODIGO AS VENDA,
                FORMAT(V.VEN_EMISSAO, 'dd/MM/yy') AS EMISSAO,
                FORMAT(CRD.CRD_VENCIMENTO_AT, 'dd/MM/yy') AS VENCIMENTO,
                V.VEN_TOTAL AS TOTAL,
                V.VEN_CLIENTE,
                C.CLI_NOME,
                F.FUN_NOME,
                F.FUN_LOGIN,
                V.VEN_FUNCIONARIO
            FROM VENDAS AS V
            INNER JOIN CONTAS_RECEBER_DADOS AS CRD ON CRD.CRD_CODIGO = V.VEN_CODIGO
            INNER JOIN CLIENTES C ON C.CLI_CODIGO = V.VEN_CLIENTE 
            INNER JOIN PLANO_PGTO PPG ON PPG.PPG_CODIGO = V.VEN_PLANO
            LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.VEN_FUNCIONARIO
            WHERE  CRD.CRD_DATA_PGTO IS NULL
            AND V.VEN_PLANO = 1016 
            ORDER BY ${orderBy} ${direction}
            ;
        `
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error("Erro ao tentar consultar Levar e Receber:", err);
        throw err;
    }
}

async function listarLevarEReceberStream(orderBy="CRD.CRD_ATRASO", direction="DESC", {onRow, onEnd, onError}){
    const pool = await getPool();
    const request = pool.request();
    request.stream = true;
    const query = `
        SELECT
            V.VEN_CODIGO AS VENDA,
            FORMAT(V.VEN_EMISSAO, 'dd/MM/yy') AS EMISSAO,
            FORMAT(CRD.CRD_VENCIMENTO_AT, 'dd/MM/yy') AS VENCIMENTO,
            V.VEN_TOTAL AS TOTAL,
            V.VEN_CLIENTE,
            C.CLI_NOME,
            F.FUN_NOME,
            F.FUN_LOGIN,
            V.VEN_FUNCIONARIO
        FROM VENDAS AS V
        INNER JOIN CONTAS_RECEBER_DADOS AS CRD ON CRD.CRD_CODIGO = V.VEN_CODIGO
        INNER JOIN CLIENTES C ON C.CLI_CODIGO = V.VEN_CLIENTE 
        INNER JOIN PLANO_PGTO PPG ON PPG.PPG_CODIGO = V.VEN_PLANO
        LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.VEN_FUNCIONARIO
        WHERE  CRD.CRD_DATA_PGTO IS NULL
        AND V.VEN_PLANO = 1016 
        ORDER BY ${orderBy} ${direction}
        ;
    `;
    request.query(query);

    request.on('row', row=>onRow(row)),
    request.on('error', err=>{
        console.error("Erro no stream de Levar e Receber:", err);
        onError(err);
    });
    request.on('done', ()=>onEnd());
}

async function  levarEReceberPorVendedor(vendedorLogin, orderBy="CRD.CRD_ATRASO", direction="DESC"){
    if(!vendedorLogin) throw new Error("Login do vendedor é obrigatório");
    try {
        const pool = await getPool();
        const query = `
            SELECT 
                V.VEN_CODIGO AS VENDA,
                FORMAT(V.VEN_EMISSAO, 'dd/MM/yy') AS EMISSAO,
                FORMAT(CRD.CRD_VENCIMENTO_AT, 'dd/MM/yy') AS VENCIMENTO,
                V.VEN_TOTAL AS TOTAL,
                CONCAT(V.VEN_CLIENTE,'  :.  ',C.CLI_NOME) AS CLIENTE ,
                F.FUN_NOME,
                F.FUN_LOGIN,
                V.VEN_FUNCIONARIO
            FROM VENDAS AS V
            INNER JOIN CONTAS_RECEBER_DADOS AS CRD ON CRD.CRD_CODIGO = V.VEN_CODIGO
            INNER JOIN CLIENTES C ON C.CLI_CODIGO = V.VEN_CLIENTE 
            INNER JOIN PLANO_PGTO PPG ON PPG.PPG_CODIGO = V.VEN_PLANO
            LEFT JOIN FUNCIONARIOS F ON F.FUN_CODIGO = V.VEN_FUNCIONARIO
            WHERE  CRD.CRD_DATA_PGTO IS NULL
            AND V.VEN_PLANO = 1016
            AND F.FUN_LOGIN = @vendedorLogin
            ORDER BY ${orderBy} ${direction}
            ;
        `;
        const result = await pool.request()
        .input('vendedorLogin', sql.VarChar, vendedorLogin)
        .query(query);        
        return result.recordset;
    } catch (err) {
        console.error("Erro ao tentar consultar Levar e Receber por vendedor:", err);
        throw err;
    }
}

module.exports = {
    listarLevarEReceber,
    listarLevarEReceberStream,
    levarEReceberPorVendedor
}