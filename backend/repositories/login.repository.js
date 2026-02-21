const SQLiteConn = require("../db/SqliteConn.js");
const { getPool } = require("../db/pool.js");
const { sql } = require("../db/connection.js");
const bcrypt = require("bcryptjs");

class UsuarioRepository {
  async buscarUsuarioPorLogin({ usuario, senha }) {
    const db = await SQLiteConn.getConnetion();
    try {
      const usuarioDB = await db.get(
        `SELECT * FROM funcionarios WHERE 1=1 AND (usuario = ?)`,
        [usuario],
      );
      return usuarioDB;
    } catch (err) {
      console.error("Erro so buscar o usuário por login.");
      return {
        success: false,
        message: "Banco de dados inacessível ou query incorreta",
        Error: err,
      };
    }
  }

  async buscarUsuarioPorId(id) {
    const db = await SQLiteConn.getConnetion();
    const usuarioDb = await db.get("SELECT * FROM usuarios WHERE id = ?", [id]);
    return usuarioDb;
  }

  async buscarTodosUsuario() {
    const db = await SQLiteConn.getConnetion();
    try {
      const todosFuncionarios = await db.then((query) =>
        query.get("select * from funcionarios"),
      );
      return todosFuncionarios;
    } catch (err) {
      console.log("Erro ao tentar obter todos os funcionarios, Error:", err);
      return {
        sucess: false,
        message: "Não foi possível obter todos os funcionários no banco",
      };
    }
  }

  async login({ usuario, senha }) {
    const dbLocal = await SQLiteConn.getConnetion();
    let userRemote = null;
    const senhaHash = await bcrypt
      .hash(senha, 10)
      .then((hash) => hash)
      .catch((e) => console.error("Nao foi possivel encryptografar a senha!"));

    const isSenhaCompare = await bcrypt.compare(senha, senhaHash)
      .then(result => result ? 1 : 0);            
    let userLocal = await dbLocal.get(
      "SELECT * FROM usuarios WHERE 1=1 AND (usuario = ?) AND (1 = ?)",
      [usuario, isSenhaCompare],
    );
    if (!userLocal) {
      userRemote = await this.obterUsuarioNoRemoto(usuario);
      if (!userRemote) {
        console.error("Usuario não encontrado no servidor Principal");
        return {
          success: false,
          message: "Usuário não encontrado no servidor Principal",
          user: usuario,
        };
      }

      await dbLocal.run(
        "INSERT INTO usuarios(nome, usuario, senha_hash)  VALUES(?,?,?)",
        [userRemote["FUN_NOME"], userRemote["FUN_LOGIN"], senhaHash],
      );
      console.log({
        success: "ok",
        message: "Usuario criado no banco de dados local",
      });
      userLocal = await { ...userRemote };
    }

    await this.inserirDadosUsuario(userLocal["id"], dbLocal);
    
    {
      return {
        success: "ok",
        user: {
          usuario: usuario,
          nome: userLocal["nome"],
        },
      };
    }
  }

  async obterUsuarioNoRemoto(fun_login) {
    const pool = await getPool();
    const query = `
    SELECT 
    FUN_CODIGO,
    FUN_LOGIN,
    FUN_NOME,
    FUN_NIVEL,
    FUN_LOJA,
    FUN_PROFISSAO
    FROM FUNCIONARIOS
    WHERE FUN_LOGIN = @login
    AND FUN_STATUS = 'A' 
    `;
    const [userRemote] = [
      await pool.request().input("login", sql.VarChar, fun_login).query(query),
    ][0].recordset;
    // await pool.close();
    return userRemote;
  }

  async inserirDadosUsuario(idUsuario, db) {
    // const db = await SQLiteConn.getConnetion();    
    await db.run(
      ` INSERT INTO usuarios_dados(id_usuario) VALUES(?);`,
      [idUsuario],
     function (err) {
        if (!err) {
          console.error(
            "Não foi possível inserir inserir na tabela usuarios_dados",
          );
          // db.close();
          return {
            success: false,
            message:
              "Não foi possível inserir inserir na tabela usuarios_dados",
            error: err,
          };
        }       
        return {
          sucess: true,
          message: "Dados inseridos na tabela usuarios_dados",
          info: {
            lastID: lastID,
            time: Date.now().toLocaleString(),
          },
        };
      },
    );
  }
}

async function deleteUserById(id) {
  const sqlite = await new SQLiteConn().deleteUser(id);
  return sqlite;
}

//getFunLogin("KLEBY", "1001");

async function test() {
  // const funcionarios = new FuncionariosRepository();
  // const user = await funcionarios.buscarUsuarioProLogin("KLEBY");
  // const user = await funcionarios.buscarTodosFuncionarios();
  // const query = "ALTER TABLE funcionarios RENAME TO usuarios;";
  // const sql = await SQLiteConn.getConnetion();
  // const user = await sql.run(query);
  // if (user) {
  //   return {
  //     success: "ok",
  //     query: "alter table",
  //   };
  // }
  // return { success: false, message: "nao alteraro" };
  const usuarioRepository = new UsuarioRepository();
  const res = await usuarioRepository.login({
    usuario: "KLEBY",
    senha: "1001",
  });
  console.log(res);
}

// console.log(test());
module.exports = UsuarioRepository;
