import { useEffect, useState } from 'react'
import './Dashboard.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Dashboard() {

  const [materials, setMaterials] = useState(0)
  const [ubicaciones, setUbicaciones] = useState(0)
  const [usuarios, setUsuarios] = useState(0)
  const [alertas, setAlertas] = useState(0)

  const [chartData, setChartData] = useState<any[]>([])

  function loadData() {

    // 📦 INVENTARIO REAL
    const data = localStorage.getItem('materials')
    const parsed = data ? JSON.parse(data) : []
    setMaterials(parsed.length)

    // 📍 UBICACIONES (placeholder)
    setUbicaciones(4)

    setUsuarios(0)
    setAlertas(0)

    // 📊 HISTORIAL → GRÁFICA
    const historyData = localStorage.getItem('history')
    const history = historyData ? JSON.parse(historyData) : []

    const processed = history.map((item: any, index: number) => ({
      name: item.material,
      valor: item.cantidad,
      index
    }))

    setChartData(processed)
  }

  useEffect(() => {
    loadData()

    window.addEventListener('storage', loadData)

    return () => {
      window.removeEventListener('storage', loadData)
    }
  }, [])

  return (
    <div className="dashboard">

      <h1>INVENTARIO DEPARTAMENTO IT</h1>

      {/* KPI CARDS */}
      <div className="grid">

        <div className="card orange">
          <h3>ARTÍCULOS</h3>
          <p>{materials}</p>
        </div>

        <div className="card orange">
          <h3>UBICACIONES</h3>
          <p>{ubicaciones}</p>
        </div>

        <div className="card white">
          <h3>USUARIOS</h3>
          <p>{usuarios}</p>
        </div>

        <div className="card orange">
          <h3>ALERTAS</h3>
          <p>{alertas}</p>
        </div>

      </div>

      
      <div className="chart-card">

        <h3>SEGUIMIENTO DE MOVIMIENTOS</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>

            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#f97316"
              strokeWidth={2}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  )
}