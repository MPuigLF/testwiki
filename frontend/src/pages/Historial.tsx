import { useEffect, useState } from 'react'
import './Historial.css'

const API = "http://localhost:3001/history"

export default function Historial() {

  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')

  async function loadHistory() {
    const res = await fetch(API)
    const data = await res.json()

    const sorted = [...data].sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    )

    setItems(sorted)
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const filtered = items.filter(item =>
    item.material?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="history-layout">

      <h1>HISTORIAL</h1>

      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table">

        <div className="row header">
          <div>MATERIAL</div>
          <div>TIPO</div>
          <div>UBICACIÓN</div>
          <div>CANTIDAD</div>
          <div>FECHA</div>
        </div>

        {filtered.map((item, i) => (
          <div className="row" key={i}>

            <div>{item.material}</div>
            <div>{item.tipo}</div>
            <div>{item.ubicacion}</div>

            <div style={{
              color: item.cantidad < 0 ? 'red' : 'green',
              fontWeight: 'bold'
            }}>
              {item.cantidad > 0 ? '+' : ''}{item.cantidad}
            </div>

            <div>{new Date(item.fecha).toLocaleString()}</div>

          </div>
        ))}

      </div>

    </div>
  )
}