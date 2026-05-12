import { useEffect, useState } from 'react'
import './Inventario.css'

const API = "http://localhost:3001/locations"

export default function Ubicaciones() {

  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  async function load() {
    const res = await fetch(API)
    setItems(await res.json())
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

  function edit(item: any) {
    setName(item.name)
    setEditId(item.id)
  }

  async function remove(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE" })
    load()
  }

  function cancelEdit() {
    setName('')
    setEditId(null)
  }

  function openPuntuar(item: any) {
    setSelectedLocation(item)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setSelectedLocation(null)
  }

  return (
    <div className="inventory-layout">

      <h1>UBICACIONES</h1>

      {/* FORM */}
      <div className="form-card">

        <input
          placeholder="Nombre ubicación"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn-edit" onClick={save}>
          {editId ? "ACTUALIZAR" : "GUARDAR"}
        </button>

        {editId !== null && (
          <button className="btn-delete" onClick={cancelEdit}>
            CANCELAR
          </button>
        )}

      </div>

      {/* TABLE */}
      <div className="table">

        <div className="row header">
          <div>NOMBRE</div>
          <div>ACCIONES</div>
        </div>

        {items.map(i => (
          <div className="row" key={i.id}>

            <div>{i.name}</div>

            <div style={{ display: "flex", gap: "6px" }}>

              <button className="btn-edit" onClick={() => edit(i)}>
                EDITAR
              </button>

              <button className="btn-delete" onClick={() => remove(i.id)}>
                BORRAR
              </button>

              
              <button
                onClick={() => openPuntuar(i)}
                style={{
                  background: "#f48439",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "normal" 
                }}
              >
                PUNTAR
              </button>

            </div>

          </div>
        ))}

      </div>

     
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
        >

          <div
            style={{
              width: "500px",
              height: "380px",
              background: "#fff",
              borderRadius: "16px",
              padding: "20px 25px", 
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
          >

            
            <h2 style={{ margin: "0 0 8px 0" }}>
              PUNTUAR UBICACIÓN
            </h2>

            <p style={{ margin: "0 0 12px 0", color: "#555" }}>
              {selectedLocation?.name}
            </p>

            
            <div
              style={{
                width: "100%",
                height: "260px",
                border: "2px dashed #bbb",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: "14px"
              }}
            >
             <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                      />
            </div>

            {/* BOTÓN CERRAR */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>

              <button
                onClick={closeModal}
                style={{
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: "20px",
                  cursor: "pointer"
                }}
              >
                CERRAR
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}