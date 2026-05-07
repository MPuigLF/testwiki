import { useEffect, useState } from 'react'
import './Historial.css'
import { getHistory } from '../data/history'

export default function Historial() {

  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState('')

  function loadHistory() {

    const history = getHistory()

    const sorted = [...history].sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    )

    setItems(sorted)
  }

  useEffect(() => {

    loadHistory()

    const update = () => loadHistory()

    // ✔️ evento interno tuyo
    window.addEventListener('history-updated', update)

    // ✔️ cambios de localStorage (otras pestañas)
    window.addEventListener('storage', update)

    // ✔️ cuando vuelves a la pestaña
    window.addEventListener('focus', update)

    return () => {
      window.removeEventListener('history-updated', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('focus', update)
    }

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

            <div>
              {new Date(item.fecha).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}