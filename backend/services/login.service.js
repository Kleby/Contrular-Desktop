const bcrypt = require("bcryptjs");
const UsuarioRepository = require("../repositories/login.repository.js");
class UsuarioService {
    constructor(){
        this.usuarioRepository = new UsuarioRepository();
    }

    async login({usuario, senha}){
        if(!usuario){
            console.error("Usuário é obrigatório!");
            return {
                "success":false,
                "message":"Usuário é obrigatório!"
            }
        }
        if(!senha){
            console.error("Senha é obrigatória");
            return {
                "success": false,
                "message": "Senha é obrigatória"
            }
        }
        const result = await this.usuarioRepository.login({usuario, senha});        
        return result;
    }
} 

async function test() {
  const UsuarioService = require("./login.service");
  const usuarioService = new UsuarioService();  
  return await usuarioService.login({usuario: "JOAO", senha: "1"})
}


test().then(data => {
    if(data.success){
        console.log("ok");
        
    }
})

async function sign({username, password}){
    console.log(username, password);
    const existsUser = await getFuncionarioByUsername(username);
    if(!existsUser){
        return existsUser
    }
    const isEqual = bcrypt.compare(password, existsUser.senha_hash);
    return isEqual && existsUser;
}

module.exports = UsuarioService

// module.exports = {
//     sign
// }