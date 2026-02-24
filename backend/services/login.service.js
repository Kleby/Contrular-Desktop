const bcrypt = require("bcryptjs");
const UsuarioRepository = require("../repositories/login.repository.js");
class LoginService {
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

        let user = await this.usuarioRepository.obterUsuarioLocal(usuario, senha); 
        if(!user){
            user = await this.usuarioRepository.obterUsuarioNoRemoto(usuario);
            if(user){
                await this.usuarioRepository.cadastrarUsuario({usuario, senha});
            }
        }       
        if(!user){
            console.error("Usuário ou senha inválidos");
            return {
                "success": false,
                "message": "Usuário ou senha inválidos",
                "user": usuario
            }
        }
        await this.usuarioRepository.inserirDadosUsuario(user.id);
        return {
            "success": true,
            "user": {
                "usuario": usuario,
            }
        }
    }
} 

async function test() {
  const LoginService = require("./login.service");
  const loginService = new LoginService();  
  return await loginService.login({usuario: "JOAO", senha: "1"})
}
module.exports = LoginService;
