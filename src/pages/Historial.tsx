import { useEffect, useState } from 'react'
import './Historial.css'

import { getHistory } from '../data/history'

export default function Historial() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setItems(getHistory())
  }, [])

  const filtered = items.filter(item =>
    item.material.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="history-layout">

      <h1>HISTORIAL DE MOVIMIENTOS</h1>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Buscar material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="table">

        <div className="row header">
          <div>MATERIAL</div>
          <div>TIPO</div>
          <div>UBICACIÓN</div>
          <div>CANTIDAD</div>
          <div>FECHA</div>
        </div>

        {filtered.map(item => (
          <div className="row" key={item.id}>
            <div>{item.material}</div>
            <div>{item.tipo}</div>
            <div>{item.ubicacion}</div>
            <div>{item.cantidad}</div>
            <div>{item.fecha}</div>
          </div>
        ))}

      </div>

    </div>
  )
}