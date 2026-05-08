import { useEffect, useState } from 'react'
import './Inventario.css'

const API = "http://localhost:3001/locations"

type Location = {
  id: number
  name: string
}

export default function Ubicaciones() {

  const [items, setItems] = useState<Location[]>([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  async function load() {
    const res = await fetch(API)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {

    if (!name.trim()) return

    if (editId !== null) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      })
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      })
    }

    setName('')
    setEditId(null)
    load()
  }

  function edit(item: Location) {
    setName(item.name)
    setEditId(item.id)
  }

  async function remove(id: number) {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    })

    load()
  }

  function reset() {
    setName('')
    setEditId(null)
  }

  return (
    <div className="inventory-layout">

      <h1>UBICACIONES</h1>

      {/* FORM */}
      <div className="form-card">

        <div className="form-title">
          {editId !== null ? 'EDITAR UBICACIÓN' : 'CREAR UBICACIÓN'}
        </div>

        <input
          className="input"
          placeholder="Nombre de la ubicación"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {/* LIST */}
      <div className="table">

        <div className="row header">
          <div>NOMBRE</div>
          <div>ACCIONES</div>
        </div>

        {items.map(item => (
          <div className="row" key={item.id}>

            <div>{item.name}</div>

            <div>

              <button className="btn-edit" onClick={() => edit(item)}>
                EDITAR
              </button>

              <button className="btn-delete" onClick={() => remove(item.id)}>
                BORRAR
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}