import { useEffect, useState } from "react"
import "./Usuarios.css"

const API = "http://localhost:3001/users"

type User = {
  id: number
  nombre: string
  email: string
  rol: string
  material: string
}

export default function Usuarios() {

  const [users, setUsers] = useState<User[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  const [form, setForm] = useState<User>({
    id: 0,
    nombre: "",
    email: "",
    rol: "usuario",
    material: ""
  })

  // 🔵 LOAD
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const res = await fetch(API)
    const data = await res.json()
    setUsers(data)
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function reset() {
    setForm({
      id: 0,
      nombre: "",
      email: "",
      rol: "usuario",
      material: ""
    })
    setEditId(null)
  }

  // 🔵 SAVE (CREATE / UPDATE)
  async function save() {

    if (editId !== null) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
    }

    await loadUsers()
    reset()
  }

  function edit(user: User) {
    setForm(user)
    setEditId(user.id)
  }

  // 🔵 DELETE
  async function remove(id: number) {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    })

    await loadUsers()
  }

  return (
    <div className="users-layout">

      <h1>GESTIÓN DE USUARIOS</h1>

      {/* FORM */}
      <div className="form-card">

        <div className="form-title">
          {editId !== null ? "EDITAR USUARIO" : "CREAR USUARIO"}
        </div>

        <input
          className="input"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          className="input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="usuario">Usuario</option>
          <option value="técnico">Técnico</option>
          <option value="administrador">Administrador</option>
        </select>

        <input
          className="input"
          name="material"
          placeholder="Material"
          value={form.material}
          onChange={handleChange}
        />

        <button className="btn-edit" onClick={save}>
          GUARDAR
        </button>

        {editId !== null && (
          <button className="btn-delete" onClick={reset}>
            CANCELAR
          </button>
        )}

      </div>

      {/* TABLE */}
      <div className="table">

        <div className="row header">
          <div>NOMBRE</div>
          <div>EMAIL</div>
          <div>ROL</div>
          <div>MATERIAL</div>
          <div>ACCIONES</div>
        </div>

        {users.map(user => (
          <div className="row" key={user.id}>

            <div>{user.nombre}</div>
            <div>{user.email}</div>
            <div>{user.rol}</div>
            <div>{user.material}</div>

            <div>
              <button className="btn-edit" onClick={() => edit(user)}>
                EDITAR
              </button>

              <button className="btn-delete" onClick={() => remove(user.id)}>
                BORRAR
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}