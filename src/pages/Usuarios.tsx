import { useEffect, useState } from 'react'
import './Usuarios.css'

import { getUsers, saveUsers, getNextUserId } from '../data/users'
import type { User } from '../data/users'

import { getMaterials } from '../data/materials'
import type { Material } from '../data/materials'

export default function Usuarios() {

  const [users, setUsers] = useState<User[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  const [form, setForm] = useState<User>({
    id: 0,
    nombre: '',
    email: '',
    rol: 'usuario',
    material: ''
  })

  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    setUsers(getUsers())
    setMaterials(getMaterials())
  }, [])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function reset() {
    setForm({
      id: 0,
      nombre: '',
      email: '',
      rol: 'usuario',
      material: ''
    })
    setEditId(null)
  }

  function save() {
    let updated = [...users]

    if (editId !== null) {
      updated = updated.map(u =>
        u.id === editId ? { ...form, id: editId } : u
      )
    } else {
      updated.push({
        ...form,
        id: getNextUserId()
      })
    }

    setUsers(updated)
    saveUsers(updated)
    reset()
  }

  function edit(user: User) {
    setForm(user)
    setEditId(user.id)
  }

  function remove(id: number) {
    const updated = users.filter(u => u.id !== id)
    setUsers(updated)
    saveUsers(updated)
  }

  return (
    <div className="users-layout">

      <h1>GESTIÓN DE USUARIOS</h1>

      {/* FORM */}
      <div className="form-card">

        <div className="form-title">
          {editId !== null ? 'EDITAR USUARIO' : 'CREAR USUARIO'}
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
          <option value="tecnico">Técnico</option>
          <option value="admin">Admin</option>
        </select>

        {/* 🔥 DESPLEGABLE DE MATERIAL */}
        <select
          name="material"
          value={form.material}
          onChange={handleChange}
        >
          <option value="">Asignar material</option>

          {materials.map(m => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </select>

        <button className="btn-edit" onClick={save}>
          GUARDAR
        </button>

        {editId !== null && (
          <button className="btn-delete" onClick={reset}>
            CANCELAR
          </button>
        )}

      </div>

      {/* TABLA */}
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