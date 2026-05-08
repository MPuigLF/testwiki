import { useEffect, useState } from 'react'
import './Inventario.css'

const API = "http://localhost:3001/materials"
const HISTORY_API = "http://localhost:3001/history"

export default function Inventario() {

  const [items, setItems] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    ubicacion: '',
    cantidad: 1
  })

  const [editId, setEditId] = useState<number | null>(null)

  const [restar, setRestar] = useState<{ [key: number]: number }>({})

  async function load() {
    const res = await fetch(API)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function addHistory(entry: any) {
    await fetch(HISTORY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    })
  }

  async function save() {

    const now = new Date().toISOString()

    if (editId !== null) {

      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      await addHistory({
        material: form.nombre,
        tipo: form.tipo,
        ubicacion: form.ubicacion,
        cantidad: form.cantidad,
        fecha: now
      })

    } else {

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      await addHistory({
        material: form.nombre,
        tipo: form.tipo,
        ubicacion: form.ubicacion,
        cantidad: form.cantidad,
        fecha: now
      })
    }

    load()
  }

  async function remove(id: number) {

    const item = items.find(i => i.id === id)
    if (!item) return

    await fetch(`${API}/${id}`, { method: "DELETE" })

    await addHistory({
      material: item.nombre,
      tipo: item.tipo,
      ubicacion: item.ubicacion,
      cantidad: -item.cantidad,
      fecha: new Date().toISOString()
    })

    load()
  }

  async function restarCantidad(id: number) {

    const cantidad = restar[id] || 0
    if (cantidad <= 0) return

    const item = items.find(i => i.id === id)
    if (!item) return

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        cantidad: item.cantidad - cantidad
      })
    })

    await addHistory({
      material: item.nombre,
      tipo: item.tipo,
      ubicacion: item.ubicacion,
      cantidad: -cantidad,
      fecha: new Date().toISOString()
    })

    setRestar({ ...restar, [id]: 0 })
    load()
  }

  return (
    <div className="inventory-layout">

      <h1>INVENTARIO</h1>

      <div className="form-card">

        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="tipo" placeholder="Tipo" onChange={handleChange} />
        <input name="cantidad" type="number" onChange={handleChange} />
        <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} />

        <button className="btn-edit" onClick={save}>
          {editId ? "ACTUALIZAR" : "GUARDAR"}
        </button>

      </div>

      <div className="table">

        {items.map(i => (
          <div className="row" key={i.id}>

            <div>{i.nombre}</div>
            <div>{i.tipo}</div>
            <div>{i.cantidad}</div>
            <div>{i.ubicacion}</div>

            <div>
              <button className="btn-delete" onClick={() => remove(i.id)}>
                BORRAR
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}