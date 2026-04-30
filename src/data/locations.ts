export type Location = {
  id: number
  name: string
}

const KEY = 'locations'
const KEY_ID = 'locations_id_counter'

/* 🧠 seed separado (solo lógica de inicialización) */
export function seedLocations() {
  const exists = localStorage.getItem(KEY)
  if (exists) return

  const initial: Location[] = [
    { id: 0, name: 'Almacen' },
    { id: 1, name: 'Oficinas A' },
    { id: 2, name: 'Sala Osona' },
    { id: 3, name: 'Laboratorio' }
  ]

  localStorage.setItem(KEY, JSON.stringify(initial))
  localStorage.setItem(KEY_ID, '4')
}

/* 📥 GET */
export function getLocations(): Location[] {
  seedLocations()
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

/* 💾 SAVE */
export function saveLocations(items: Location[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

/* 🔢 ID */
export function getNextLocationId(): number {
  const current = localStorage.getItem(KEY_ID)
  const next = current ? parseInt(current) : 0
  localStorage.setItem(KEY_ID, String(next + 1))
  return next
}