const inVendedor = document.getElementById("vendedor");
const output = document.getElementById("saida");
const btnLogin = document.getElementById("btn-levar-receber-por-vendedor");
const btnTodos = document.getElementById("btn-levar-receber-todos");
const btnStream = document.getElementById("btn-levar-receber-stream");

btnLogin.addEventListener("click", async () => {
    const vendedor = inVendedor.value;
    const res = await window.app.levarReceberPorVendedor(vendedor.toUpperCase());
    output.textContent = JSON.stringify(res, null, 2);
});

btnTodos.addEventListener("click", async () => {
    const res = await window.app.listarLevarReceber();
    output.textContent = JSON.stringify(res, null, 2);
});


//usando stream para listar levar e receber
btnStream.addEventListener("click", async () => {
    output.textContent = "Carregando levar e receber em stream...\n[\n";
     await window.app.startLevarReceberStream();
});

window.app.onLevarReceberChunk((chunk)=>{
    output.textContent += `Registro recebido: ${JSON.stringify(chunk, null, 2)},\n`;
});

window.app.onLevarReceberStreamEnd(()=>{
    output.textContent += "]\n\nFim do stream de levar e receber.\n";
});

window.app.onLevarReceberStreamError((err)=>{
    output.textContent += `Erro no stream de levar e receber: ${err.message}\n`;
}); 