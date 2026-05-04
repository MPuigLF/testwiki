import { useEffect, useState } from 'react'
import './Notificaciones.css'

type Material = {
  id: number
  nombre: string
  cantidad: number
}

export default function Notificaciones() {

  const [outOfStock, setOutOfStock] = useState<Material[]>([])

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    const data = localStorage.getItem('materials')
    const materials = data ? JSON.parse(data) : []

    const filtered = materials.filter((m: Material) => m.cantidad === 0)

    setOutOfStock(filtered)
  }

  if (outOfStock.length === 0) return null

  return (
    <div className="toast-container">

      {outOfStock.map(m => (
        <div key={m.id} className="toast-error">
           {m.nombre} SIN STOCK
        </div>
      ))}

    </div>
  )
}