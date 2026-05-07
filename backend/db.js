const mysql = require("mysql2")

const connection = mysql.createConnection({
host: "127.0.0.1",
port: 3306,
user: "appuser",
password: "app123",
database: "wiki"
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