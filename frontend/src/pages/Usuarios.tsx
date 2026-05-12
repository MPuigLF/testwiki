import { useEffect, useState } from "react"
import "./Usuarios.css"

const API = "http://localhost:3001/users"
const MATERIALS_API = "http://localhost:3001/materials"

export default function Usuarios() {

  const [users, setUsers] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [editId, setEditId] = useState<number | null>(null)

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol: "usuario",
    material: ""
  })

  useEffect(() => {
    load()
    fetch(MATERIALS_API).then(r => r.json()).then(setMaterials)
  }, [])

  async function load() {
    setUsers(await (await fetch(API)).json())
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function edit(user: any) {
    setForm(user)
    setEditId(user.id)
  }

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

    setForm({ nombre: "", email: "", rol: "usuario", material: "" })
    setEditId(null)
    load()
  }

  async function remove(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="users-layout">

      <h1>USUARIOS</h1>

      <div className="form-card">

        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />

        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="usuario">Usuario</option>
          <option value="técnico">Técnico</option>
          <option value="administrador">Administrador</option>
        </select>

        <select name="material" value={form.material} onChange={handleChange}>
          <option value="">Material</option>
          {materials.map(m => (
            <option key={m.id} value={m.nombre}>{m.nombre}</option>
          ))}
        </select>

        <button className="btn-edit" onClick={save}>
          {editId ? "ACTUALIZAR" : "GUARDAR"}
        </button>

      </div>

      <div className="table">

        <div className="row header">
          <div>NOMBRE</div>
          <div>EMAIL</div>
          <div>ROL</div>
          <div>MATERIAL</div>
          <div>ACCIONES</div>
        </div>

        {users.map(u => (
          <div className="row" key={u.id}>

            <div>{u.nombre}</div>
            <div>{u.email}</div>
            <div>{u.rol}</div>
            <div>{u.material}</div>

            <div>
              <button className="btn-edit" onClick={() => edit(u)}>
                EDITAR
              </button>

              <button className="btn-delete" onClick={() => remove(u.id)}>
                BORRAR
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}