const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

// TEST API
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀")
})

// EJEMPLO USERS
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json(err)
    }
    res.json(results)
  })
})

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001")
})