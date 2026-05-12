require("dotenv").config()

const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

app.use(cors())
app.use(express.json())

// ========================
// TEST
// ========================
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀")
})

/* ========================
   USERS
======================== */

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})

app.post("/users", (req, res) => {
  const { nombre, email, rol, material } = req.body

  db.query(
    "INSERT INTO users (nombre, email, rol, material) VALUES (?, ?, ?, ?)",
    [nombre, email, rol, material],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ id: result.insertId, ...req.body })
    }
  )
})

app.put("/users/:id", (req, res) => {
  const { nombre, email, rol, material } = req.body

  db.query(
    "UPDATE users SET nombre=?, email=?, rol=?, material=? WHERE id=?",
    [nombre, email, rol, material, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ message: "updated" })
    }
  )
})

app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: "deleted" })
  })
})

/* ========================
   MATERIALS
======================== */

app.get("/materials", (req, res) => {
  db.query("SELECT * FROM materials", (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})

app.post("/materials", (req, res) => {
  const { nombre, tipo, ubicacion, cantidad } = req.body

  db.query(
    "INSERT INTO materials (nombre, tipo, ubicacion, cantidad) VALUES (?, ?, ?, ?)",
    [nombre, tipo, ubicacion, cantidad],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ id: result.insertId, ...req.body })
    }
  )
})

app.put("/materials/:id", (req, res) => {
  const { nombre, tipo, ubicacion, cantidad } = req.body

  db.query(
    "UPDATE materials SET nombre=?, tipo=?, ubicacion=?, cantidad=? WHERE id=?",
    [nombre, tipo, ubicacion, cantidad, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ message: "updated" })
    }
  )
})

app.delete("/materials/:id", (req, res) => {
  db.query("DELETE FROM materials WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: "deleted" })
  })
})

/* ========================
   LOCATIONS
======================== */

app.get("/locations", (req, res) => {
  db.query("SELECT * FROM locations", (err, results) => {
    if (err) return res.status(500).json(err)
    res.json(results)
  })
})

app.post("/locations", (req, res) => {
  db.query(
    "INSERT INTO locations (name) VALUES (?)",
    [req.body.name],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ id: result.insertId, name: req.body.name })
    }
  )
})

app.put("/locations/:id", (req, res) => {
  db.query(
    "UPDATE locations SET name=? WHERE id=?",
    [req.body.name, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err)
      res.json({ message: "updated" })
    }
  )
})

app.delete("/locations/:id", (req, res) => {
  db.query("DELETE FROM locations WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ message: "deleted" })
  })
})

/* ========================
   HISTORY (CLEAN FINAL)
======================== */

app.get("/history", (req, res) => {
  db.query(
    "SELECT * FROM history ORDER BY id DESC",
    (err, results) => {
      if (err) return res.status(500).json(err)
      res.json(results)
    }
  )
})

app.post("/history", (req, res) => {

  const { material, tipo, ubicacion, cantidad } = req.body

  db.query(
    `INSERT INTO history 
    (material, tipo, ubicacion, cantidad, fecha)
    VALUES (?, ?, ?, ?, NOW())`,
    [material, tipo, ubicacion, cantidad],
    (err, result) => {
      if (err) return res.status(500).json(err)
      res.json({ id: result.insertId })
    }
  )
})

/* ======================== */

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🟢 Backend running on http://localhost:${PORT}`)
})