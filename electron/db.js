const sql = require("mssql");

let pool;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE_NAME_PRIVATE,
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX),
    min: Number(process.env.DB_POOL_MIN),
    idleTimeoutMillis: Number(process.env.IDLE_TIMEOUT),
  },
};

async function connect() {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
}

exports.listStore = async () => {
  try {
    const conn = await connect();
    const result = await conn.request().query("SELECT * FROM [Sales].[Store]");
    return result.recordset;
  } catch (error) {
    console.error("❌ Failed to list stores:", error);
    throw error;
  }
};
