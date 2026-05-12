import { useEffect, useState } from 'react'
import './Historial.css'

const API = "http://localhost:3001/history"

export default function Historial() {

  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')

  async function load() {
    const res = await fetch(API)
    setItems(await res.json())
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = items.filter(i =>
    i.material?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="history-layout">

      <h1>HISTORIAL</h1>

      <input
        placeholder="Buscar material..."
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

        {filtered.map((i, idx) => (
          <div className="row" key={idx}>

            <div>{i.material}</div>
            <div>{i.tipo}</div>
            <div>{i.ubicacion}</div>

            <div style={{
              color: i.cantidad < 0 ? "red" : "green",
              fontWeight: "bold"
            }}>
              {i.cantidad > 0 ? "+" : ""}{i.cantidad}
            </div>

            <div>
              {new Date(i.fecha).toLocaleString()}
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}