import { Routes, Route } from 'react-router-dom'

import AppLayout from './layout/AppLayout'

import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import Ubicaciones from './pages/Ubicaciones'
import Historial from './pages/Historial'
import Usuarios from './pages/Usuarios'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ubicaciones" element={<Ubicaciones />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </AppLayout>
  )
}