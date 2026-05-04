import { useEffect, useState } from 'react'
import './Alertas.css'

type Material = {
  id: number
  nombre: string
  cantidad: number
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function Alertas({ open, onClose }: Props) {

  const [lowStock, setLowStock] = useState<Material[]>([])

  useEffect(() => {
    if (open) loadAlerts()
  }, [open])

  function loadAlerts() {
    const data = localStorage.getItem('materials')
    const materials = data ? JSON.parse(data) : []

    const filtered = materials.filter((m: Material) => m.cantidad < 200)

    setLowStock(filtered)
  }

  return (
    <>
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={onClose}></div>}

      {/* SIDEBAR */}
      <div className={`alertas-sidebar ${open ? 'open' : ''}`}>

        <div className="alertas-header">
          <h2>⚠️ ALERTAS</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="alertas-content">

          {lowStock.length === 0 && (
            <p className="no-alerts">Todo en orden 👍</p>
          )}

          {lowStock.map(m => (
            <div key={m.id} className="alert-card">
              <h4>{m.nombre}</h4>
              <p>Stock: {m.cantidad}</p>
            </div>
          ))}

        </div>

      </div>
    </>
  )
}