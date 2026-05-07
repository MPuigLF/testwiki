// Dashboard.tsx

import { useEffect, useState } from 'react'
import './Dashboard.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

import Alertas from '../components/Alertas/Alertas'
import Notificaciones from '../components/Notificaciones/Notificaciones'
import { getUsers } from '../data/users'
import { getMaterials } from '../data/materials'

export default function Dashboard() {

  const [materials, setMaterials] = useState(0)
  const [ubicaciones, setUbicaciones] = useState(0)
  const [usuarios, setUsuarios] = useState(0)
  const [alertas, setAlertas] = useState(0)

  const [chartData, setChartData] = useState<any[]>([])
  const [openAlertas, setOpenAlertas] = useState(false)

  function loadData() {

    const parsed = getMaterials()

    setMaterials(parsed.length)

    const uniqueLocations = [
      ...new Set(parsed.map((m: any) => m.ubicacion).filter(Boolean))
    ]

    setUbicaciones(uniqueLocations.length)

    setUsuarios(getUsers().length)

    setAlertas(parsed.filter((m: any) => m.cantidad < 200).length)

    const history = JSON.parse(localStorage.getItem('history') || '[]')

    const sorted = [...history].sort(
      (a: any, b: any) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )

    let stock = 0

    const processed = sorted.map((item: any, index: number) => {

      const entradas = item.cantidad > 0 ? item.cantidad : 0
      const salidas = item.cantidad < 0 ? Math.abs(item.cantidad) : 0

      stock += entradas - salidas

      return {
        index: index + 1,
        stock,
        entradas,
        salidas
      }
    })

    setChartData(processed)
  }

  useEffect(() => {

    loadData()

    const handleStorage = () => {
      loadData()
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }

  }, [])

  return (
    <div className="dashboard">

      <h1>INVENTARIO IT</h1>

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

        <div
          className="card orange"
          onClick={() => setOpenAlertas(true)}
        >
          <h3>ALERTAS</h3>
          <p>{alertas}</p>
        </div>

      </div>

      <div className="chart-card">

        <h3>MOVIMIENTOS</h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={chartData}>

            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="stock"
              stroke="#111827"
              strokeWidth={3}
              dot={false}
              name="Stock"
            />

            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              name="Entradas"
            />

            <Line
              type="monotone"
              dataKey="salidas"
              stroke="#fdba74"
              strokeWidth={2}
              dot={false}
              name="Salidas"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <Alertas
        open={openAlertas}
        onClose={() => setOpenAlertas(false)}
      />

      <Notificaciones />

    </div>
  )
}