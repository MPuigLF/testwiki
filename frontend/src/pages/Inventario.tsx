import { useEffect, useState } from 'react'
import './Inventario.css'

const API = "http://localhost:3001/materials"
const LOCATIONS_API = "http://localhost:3001/locations"
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

  // 👇 RESTA PER CADA MATERIAL (IMPORTANT)
  const [restes, setRestes] = useState<{ [key: number]: number }>({})

  async function load() {
    const res = await fetch(API)
    setItems(await res.json())
  }

  async function loadLocations() {
    const res = await fetch(LOCATIONS_API)
    setLocations(await res.json())
  }

  useEffect(() => {
    load()
    loadLocations()
  }, [])

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function log(data: any, action: string = "UPDATE") {
    await fetch(HISTORY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material: data.nombre,
        tipo: data.tipo,
        ubicacion: data.ubicacion,
        cantidad: data.cantidad,
        action
      })
    })
  }

  async function save() {

    if (editId !== null) {

      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      await log(form, "UPDATE")

    } else {

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      await log(form, "CREATE")
    }

    setEditId(null)
    setForm({ nombre: '', tipo: '', ubicacion: '', cantidad: 1 })
    load()
  }

  function edit(item: any) {
    setForm(item)
    setEditId(item.id)
  }

  async function remove(id: number) {

    const item = items.find(i => i.id === id)

    await fetch(`${API}/${id}`, { method: "DELETE" })

    if (item) await log(item, "DELETE")

    load()
  }

  // ➖ RESTAR STOCK
  async function restarCantidad(id: number, cantidadARestar: number) {

    const item = items.find(i => i.id === id)
    if (!item) return

    const nuevaCantidad = Number(item.cantidad) - Number(cantidadARestar)

    if (nuevaCantidad < 0) {
      alert("No hi ha prou stock")
      return
    }

    const updated = {
      ...item,
      cantidad: nuevaCantidad
    }

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })

    await log(updated, "RESTA")

    load()
  }

  return (
    <div className="inventory-layout">

      <h1>INVENTARIO</h1>

      <div className="form-card">

        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          placeholder="Tipo"
        />

        <input
          name="cantidad"
          type="number"
          value={form.cantidad}
          onChange={handleChange}
        />

        <select
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
        >
          <option value="">Ubicación</option>
          {locations.map(l => (
            <option key={l.id} value={l.name}>{l.name}</option>
          ))}
        </select>

        <button className="btn-edit" onClick={save}>
          {editId ? "ACTUALIZAR" : "GUARDAR"}
        </button>

      </div>

      <div className="table">

        <div className="row header">
          <div>NOMBRE</div>
          <div>TIPO</div>
          <div>CANTIDAD</div>
          <div>UBICACIÓN</div>
          <div>ACCIONES</div>
        </div>

        {items.map(i => (
          <div className="row" key={i.id}>

            <div>{i.nombre}</div>
            <div>{i.tipo}</div>
            <div>{i.cantidad}</div>
            <div>{i.ubicacion}</div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>

              <button className="btn-edit" onClick={() => edit(i)}>
                EDITAR
              </button>

              <button className="btn-delete" onClick={() => remove(i.id)}>
                BORRAR
              </button>

              
              <input
                type="number"
                value={restes[i.id] ?? 1}
                onChange={(e) =>
                  setRestes({
                    ...restes,
                    [i.id]: Number(e.target.value)
                  })
                }
                style={{ width: '70px' }}
                min={1}
              />

              <button
                className="btn-gest"
                onClick={() => restarCantidad(i.id, restes[i.id] ?? 1)}
              >
                RESTAR
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}