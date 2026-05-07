const MATERIALS_KEY = 'materials'

/* 🔢 MATERIALS */
export function getMaterialsCount(): number {
  const data = localStorage.getItem(MATERIALS_KEY)
  return data ? JSON.parse(data).length : 0
}

/* 📍 UBICACIONES (temporal, luego lo haremos dinámico) */
export function getUbicacionesCount(): number {
  return 4
}

/* 👤 USUARIOS (placeholder) */
export function getUsuariosCount(): number {
  return 0
}

/* ⚠️ ALERTAS (placeholder) */
export function getAlertasCount(): number {
  return 0
}