require("dotenv").config()

const mysql = require("mysql2")

// 🔍 DEBUG: veure què està carregant realment del .env
console.log("DB_HOST =", process.env.DB_HOST)
console.log("DB_PORT =", process.env.DB_PORT)
console.log("DB_USER =", process.env.DB_USER)
console.log("DB_NAME =", process.env.DB_NAME)

// 🔌 Crear connexió MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// 🚀 Connexió a la base de dades
connection.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:")
    console.error(err.message)
    return
  }

  console.log("🟢 Conectado a MySQL correctamente")

  // 🧠 VERIFICACIÓ REAL DE LA DB CONNECTADA
  connection.query("SELECT DATABASE() AS db", (err, res) => {
    if (err) {
      console.error("❌ Error obteniendo DB actual:", err.message)
      return
    }
    console.log("🧠 DB REAL CONNECTADA:", res[0].db)
  })
})

module.exports = connection