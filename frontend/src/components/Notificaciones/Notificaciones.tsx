import { useEffect, useState } from 'react'
import './Notificaciones.css'

const API = "http://localhost:3001/materials"

type Material = {
  id: number
  nombre: string
  cantidad: number
}

export default function Notificaciones() {

  const [outOfStock, setOutOfStock] = useState<Material[]>([])

  useEffect(() => {

    loadData()

    // refresca automàticament cada 2 segons
    const interval = setInterval(() => {
      loadData()
    }, 2000)

    return () => clearInterval(interval)

  }, [])

  async function loadData() {

    try {

      const res = await fetch(API)

      if (!res.ok) {
        throw new Error("Error carregant materials")
      }

      const materials: Material[] = await res.json()

      // Filtra materials sense stock
      const filtered = materials.filter(
        (m) => Number(m.cantidad) <= 0
      )

      setOutOfStock(filtered)

    } catch (error) {

      console.error("Error a notificacions:", error)

    }
  }

  // Si no hi ha notificacions → no mostra res
  if (outOfStock.length === 0) return null

  return (
    <div className="toast-container">

      {outOfStock.map((m) => (

        <div key={m.id} className="toast-error">

          ⚠️ {m.nombre} SIN STOCK

        </div>

      ))}

    </div>
  )
}