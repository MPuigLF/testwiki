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

import Alertas from '../components/Alertas/Alertas'
import Notificaciones from '../components/Notificaciones/Notificaciones'
import { getUsers } from '../data/users'

export default function Dashboard() {

  const [materials, setMaterials] = useState(0)
  const [ubicaciones, setUbicaciones] = useState(0)
  const [usuarios, setUsuarios] = useState(0)
  const [alertas, setAlertas] = useState(0)

  const [openAlertas, setOpenAlertas] = useState(false)

  const [chartData, setChartData] = useState<any[]>([])

  function loadData() {

    // MATERIALS
    const data = localStorage.getItem('materials')
    const parsed = data ? JSON.parse(data) : []
    setMaterials(parsed.length)

    // UBICACIONES
    setUbicaciones(4)

    // USUARIOS
    const users = getUsers()
    setUsuarios(users.length)

    // ALERTAS (stock < 200)
    const low = parsed.filter((m: any) => m.cantidad < 200)
    setAlertas(low.length)

    // HISTORIAL
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

        {/* 👇 CLICKABLE */}
        <div
          className="card orange"
          onClick={() => setOpenAlertas(true)}
          style={{ cursor: 'pointer' }}
        >
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

      {/* 👇 SIDEBAR ALERTAS */}
      <Alertas
        open={openAlertas}
        onClose={() => setOpenAlertas(false)}
      />
<Notificaciones />
    </div>
  )
}