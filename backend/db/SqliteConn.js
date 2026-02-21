const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("node:path");

module.exports = class SQLiteConn {
  static db = null;
  static promiseInit = null;
  static async getConnetion() {
    try {
      if (SQLiteConn.db) return  SQLiteConn.db;
      if (SQLiteConn.promiseInit) return SQLiteConn.promiseInit;
      return SQLiteConn.promiseInit = await (async () => {
        SQLiteConn.db = await open({
          filename: path.join(__dirname, "/database.db"),
          driver: sqlite3.Database,
        });
        await SQLiteConn.db.exec("PRAGMA foreign_keys = ON;");
        await this.createTables();
        console.log("Banco de dados e tabelas prontos.");
        return SQLiteConn.db;
      })();  
    } catch (error) {
      console.error("Não foi possivel conectar  ao banco de dados");
      throw new Error({
        "success": false,
        "message": "Erro na com o db local",
        "error": error
      })
    }
  }

  static async createTables() {
    // Criar Usuarios
    await this.db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      usuario TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      ativo INTEGER NOT NULL CHECK( ativo IN (0,1)) DEFAULT 1
    );
  `);

    // Criar Perfils
    await this.db.exec(`
    CREATE TABLE IF NOT EXISTS perfils(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT, 
      id_usuario INTEGER NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

    // Criando Usuarios dados
    await this.db.exec(`
                CREATE TABLE IF NOT EXISTS usuarios_dados(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  data_acesso TEXT DEFAULT (datetime('now', 'localtime')),
                  id_usuario INTEGER NOT NULL,
                  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
                );`);
  }
};
