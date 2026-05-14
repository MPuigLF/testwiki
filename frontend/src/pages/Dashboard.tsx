import { useEffect, useState } from 'react'
import './Dashboard.css'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts'

import Alertas from '../components/Alertas/Alertas'
import Notificaciones from '../components/Notificaciones/Notificaciones'

const USERS_API = "http://localhost:3001/users"
const MATERIALS_API = "http://localhost:3001/materials"
const HISTORY_API = "http://localhost:3001/history"

export default function Dashboard() {

  const [materials, setMaterials] = useState(0)
  const [ubicaciones, setUbicaciones] = useState(0)
  const [usuarios, setUsuarios] = useState(0)
  const [alertas, setAlertas] = useState(0)

  const [chartData, setChartData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])

  const [openAlertas, setOpenAlertas] = useState(false)

  async function loadData() {

    // USERS
    const usersRes = await fetch(USERS_API)
    const users = await usersRes.json()

    // MATERIALS
    const matRes = await fetch(MATERIALS_API)
    const materialsData = await matRes.json()

    // HISTORY
    const histRes = await fetch(HISTORY_API)
    const history = await histRes.json()

    setUsuarios(users.length)
    setMaterials(materialsData.length)

    const uniqueLocations = [
      ...new Set(
        materialsData
          .map((m: any) => m.ubicacion)
          .filter(Boolean)
      )
    ]

    setUbicaciones(uniqueLocations.length)

    setAlertas(
      materialsData.filter(
        (m: any) => m.cantidad < 200
      ).length
    )

    // ORDENAR HISTORIAL
    const sorted = [...history].sort(
      (a: any, b: any) =>
        new Date(a.fecha).getTime() -
        new Date(b.fecha).getTime()
    )

    // GRÁFICA ORIGINAL
    const processed = sorted.map(
      (item: any, index: number) => ({

        index: index + 1,

        stock: item.cantidad,

        entradas:
          item.cantidad > 0
            ? item.cantidad
            : 0,

        salidas:
          item.cantidad < 0
            ? Math.abs(item.cantidad)
            : 0
      })
    )

    setChartData(processed)

    // TENDENCIA GENERAL
    let acumulado = 0

    const trendProcessed = sorted.map(
      (item: any, index: number) => {

        acumulado += Number(item.cantidad)

        return {
          index: index + 1,
          tendencia: acumulado
        }
      }
    )

    setTrendData(trendProcessed)
  }

  useEffect(() => {
    loadData()
  }, [])

  // COLOR DINÁMICO
  const trendColor =
    trendData.length >= 2 &&
    trendData[trendData.length - 1]?.tendencia >=
    trendData[0]?.tendencia
      ? "#22c55e"
      : "#ef4444"

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

        <div className="card orange">
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

      {/* 📊 GRÁFICA ORIGINAL */}
      <div className="chart-card">

        <h3>MOVIMIENTOS</h3>

        <ResponsiveContainer width="100%" height={350}>

          <LineChart data={chartData}>

            <XAxis dataKey="index" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="stock"
              stroke="#8494b7"
            />

            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#f97316"
            />

            <Line
              type="monotone"
              dataKey="salidas"
              stroke="#fdba74"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* 📈 TENDENCIA GENERAL */}
      <div className="chart-card">

        <h3>TENDENCIA GENERAL</h3>

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={trendData}>

            <defs>

              <linearGradient
                id="colorTrend"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor={trendColor}
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor={trendColor}
                  stopOpacity={0.05}
                />

              </linearGradient>

            </defs>

            <XAxis dataKey="index" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Area
              type="monotone"
              dataKey="tendencia"
              stroke={trendColor}
              fillOpacity={1}
              fill="url(#colorTrend)"
              strokeWidth={4}
            />

          </AreaChart>

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