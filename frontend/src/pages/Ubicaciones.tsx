import { useEffect, useState } from 'react'
import './Inventario.css'

import {
  getLocations,
  saveLocations,
  getNextLocationId
} from '../data/locations'

import type { Location } from '../data/locations'

export default function Ubicaciones() {
  const [items, setItems] = useState<Location[]>([])

  const [name, setName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    setItems(getLocations())
  }, [])

  function save() {
    if (!name.trim()) return

    let updated = [...items]

    if (editId !== null) {
      updated = updated.map(l =>
        l.id === editId ? { id: editId, name } : l
      )
    } else {
      updated.push({
        id: getNextLocationId(),
        name
      })
    }

    setItems(updated)
    saveLocations(updated)
    reset()
  }

  function edit(item: Location) {
    setName(item.name)
    setEditId(item.id)
  }

  function remove(id: number) {
    const updated = items.filter(l => l.id !== id)
    setItems(updated)
    saveLocations(updated)
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

      {/* LISTA */}
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