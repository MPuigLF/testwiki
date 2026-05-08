require("dotenv").config({ override: true })

const mysql = require("mysql2")

// 🔍 DEBUG (això et dirà què està llegint REALMENT)
console.log("DB_HOST =", process.env.DB_HOST)
console.log("DB_PORT =", process.env.DB_PORT)
console.log("DB_USER =", process.env.DB_USER)
console.log("DB_NAME =", process.env.DB_NAME)

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:")
    console.error(err.message)
    return
  }

  console.log("🟢 Conectado a MySQL correctamente")
})

module.exports = connection