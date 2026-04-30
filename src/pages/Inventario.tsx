import { useEffect, useState } from 'react'
import './Inventario.css'

import { getMaterials, saveMaterials, getNextId } from '../data/materials'
import type { Material } from '../data/materials'

import { getLocations } from '../data/locations'
import type { Location } from '../data/locations'

import { addHistory } from '../data/history'

export default function Inventario() {

  const [items, setItems] = useState<Material[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  const [form, setForm] = useState<Material>({
    id: 0,
    nombre: '',
    tipo: '',
    ubicacion: '',
    cantidad: 1
  })

  const [editId, setEditId] = useState<number | null>(null)

  // 🔥 NUEVO: control de restas por fila
  const [restar, setRestar] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    setItems(getMaterials())
    setLocations(getLocations())
  }, [])

  function handleChange(e: any) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'cantidad' ? Number(value) || 1 : value
    })
  }

  function reset() {
    setForm({
      id: 0,
      nombre: '',
      tipo: '',
      ubicacion: '',
      cantidad: 1
    })
    setEditId(null)
  }

  function save() {
    let updated = [...items]
    const now = new Date().toLocaleString()

    if (editId !== null) {
      updated = updated.map(m =>
        m.id === editId ? { ...form, id: editId } : m
      )

      addHistory({
        action: 'EDITADO',
        material: form.nombre,
        tipo: form.tipo,
        ubicacion: form.ubicacion,
        cantidad: form.cantidad,
        fecha: now
      })
    } else {
      const newItem = {
        ...form,
        id: getNextId()
      }

      updated.push(newItem)

      addHistory({
        action: 'CREADO',
        material: newItem.nombre,
        tipo: newItem.tipo,
        ubicacion: newItem.ubicacion,
        cantidad: newItem.cantidad,
        fecha: now
      })
    }

    setItems(updated)
    saveMaterials(updated)
    reset()
  }

  function edit(item: Material) {
    setForm(item)
    setEditId(item.id)
  }

  function remove(id: number) {
    const item = items.find(i => i.id === id)

    const updated = items.filter(m => m.id !== id)

    setItems(updated)
    saveMaterials(updated)

    addHistory({
      action: 'BORRADO',
      material: item?.nombre || '',
      tipo: item?.tipo || '',
      ubicacion: item?.ubicacion || '',
      cantidad: item?.cantidad || 0,
      fecha: new Date().toLocaleString()
    })
  }

  // 🔥 NUEVO: restar stock
  function restarCantidad(id: number) {
    const cantidad = restar[id] || 0
    if (cantidad <= 0) return

    const now = new Date().toLocaleString()

    const updated = items.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad - cantidad

        return {
          ...item,
          cantidad: nuevaCantidad < 0 ? 0 : nuevaCantidad
        }
      }
      return item
    })

    setItems(updated)
    saveMaterials(updated)

    const item = items.find(i => i.id === id)

    if (item) {
      addHistory({
        action: 'EDITADO',
        material: item.nombre,
        tipo: item.tipo,
        ubicacion: item.ubicacion,
        cantidad: -cantidad,
        fecha: now
      })
    }

    setRestar({ ...restar, [id]: 0 })
  }

  return (
    <div className="inventory-layout">

      <h1>INVENTARIO DE MATERIAL</h1>

      {/* FORM */}
      <div className="form-card">

        <div className="form-title">
          {editId !== null ? 'EDITAR MATERIAL' : 'CREAR MATERIAL'}
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
          name="tipo"
          placeholder="Tipo"
          value={form.tipo}
          onChange={handleChange}
        />

        <input
          className="input"
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          min={1}
        />

        <select
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
        >
          <option value="">Selecciona la ubicación</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
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
          <div>TIPO</div>
          <div>CANTIDAD</div>
          <div>UBICACIÓN</div>
          <div>RESTAR</div>
          <div>ACCIONES</div>
        </div>

        {items.map(item => (
          <div className="row" key={item.id}>

            <div>{item.nombre}</div>
            <div>{item.tipo}</div>
            <div>{item.cantidad}</div>
            <div>{item.ubicacion}</div>

            {/* RESTAR STOCK */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                min={0}
                value={restar[item.id] || ''}
                onChange={(e) =>
                  setRestar({
                    ...restar,
                    [item.id]: Number(e.target.value)
                  })
                }
                style={{
                  width: 60,
                  padding: 4
                }}
              />

              <button
                className="btn-edit"
                onClick={() => restarCantidad(item.id)}
              >
                OK
              </button>
            </div>

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