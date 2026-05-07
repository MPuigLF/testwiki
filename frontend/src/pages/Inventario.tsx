import { useEffect, useState } from 'react'
import './Inventario.css'

import {
  getMaterials,
  saveMaterials,
  getNextId
} from '../data/materials'

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

  const [restar, setRestar] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    setItems(getMaterials())
    setLocations(getLocations())
  }, [])

  function emitUpdate() {
    window.dispatchEvent(new Event('history-updated'))
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]:
        name === 'cantidad'
          ? Number(value) || 1
          : value
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
    const now = new Date().toISOString()

    if (editId !== null) {

      updated = updated.map(item =>
        item.id === editId ? { ...form, id: editId } : item
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

    emitUpdate()
    reset()
  }

  function edit(item: Material) {
    setForm(item)
    setEditId(item.id)
  }

  function remove(id: number) {

    const item = items.find(i => i.id === id)
    if (!item) return

    const updated = items.filter(i => i.id !== id)

    setItems(updated)
    saveMaterials(updated)

    addHistory({
      action: 'BORRADO',
      material: item.nombre,
      tipo: item.tipo,
      ubicacion: item.ubicacion,
      cantidad: -item.cantidad,
      fecha: new Date().toISOString()
    })

    emitUpdate()
  }

  function restarCantidad(id: number) {

    const cantidad = restar[id] || 0
    if (cantidad <= 0) return

    const item = items.find(i => i.id === id)
    if (!item) return

    const updated = items.map(i =>
      i.id === id
        ? { ...i, cantidad: i.cantidad - cantidad }
        : i
    )

    setItems(updated)
    saveMaterials(updated)

    addHistory({
      action: 'EDITADO',
      material: item.nombre,
      tipo: item.tipo,
      ubicacion: item.ubicacion,
      cantidad: -cantidad,
      fecha: new Date().toISOString()
    })

    setRestar({ ...restar, [id]: 0 })

    emitUpdate()
  }

  return (
    <div className="inventory-layout">

      <h1>INVENTARIO</h1>

      <div className="form-card">

        <input className="input" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        <input className="input" name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} />

        <input
          className="input"
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          min={1}
        />

        <select
          className="input"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
        >
          <option value="">Ubicación</option>
          {locations.map(l => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <button className="btn-edit" onClick={save}>
          {editId ? 'ACTUALIZAR' : 'GUARDAR'}
        </button>

        {editId && (
          <button className="btn-delete" onClick={reset}>
            CANCELAR
          </button>
        )}

      </div>

      <div
        className="table"
        style={{ ['--cols' as any]: '2fr 1fr 1fr 1fr 1fr 1fr' }}
      >

        <div className="row header">
          <div>Nombre</div>
          <div>Tipo</div>
          <div>Cantidad</div>
          <div>Ubicación</div>
          <div>Restar</div>
          <div>Acciones</div>
        </div>

        {items.map(item => (

          <div className="row" key={item.id}>

            <div>{item.nombre}</div>
            <div>{item.tipo}</div>
            <div>{item.cantidad}</div>
            <div>{item.ubicacion}</div>

            <div>

              <input
                className="input"
                type="number"
                value={restar[item.id] || ''}
                onChange={(e) =>
                  setRestar({
                    ...restar,
                    [item.id]: Number(e.target.value)
                  })
                }
              />

              <button className="btn-edit" onClick={() => restarCantidad(item.id)}>
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