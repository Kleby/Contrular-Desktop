document.addEventListener("DOMContentLoaded", ()=>{
    const inUsername = document.getElementById("username");
    const inPassword = document.getElementById("password");
    const btnSign = document.getElementById("btn-sign");
    // const btnRegister = document.getElementById("btn-register");
    inUsername.focus();

    inUsername.addEventListener("input", (e)=>{
        e.target.value = e.target.value.toUpperCase();

    });

    function getCredentials(){
        const usuario = inUsername.value;
        const senha = inPassword.value;
        return {usuario, senha};
    }

    btnSign.addEventListener("click", async ()=>{
        const result = getCredentials();
        const response = await window.app.login(result);
    });


    inUsername.addEventListener("keydown", (e)=>{
        if(e.key === "Enter") inPassword.focus();
    });
    inPassword.addEventListener("keydown", (e)=>{
        if(e.key === "Enter") btnSign.click();
    }
    )
});
