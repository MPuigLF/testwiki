export type Material = {
  id: number
  nombre: string
  tipo: string
  ubicacion: string
  cantidad: number
}
const KEY = 'materials'
const KEY_ID = 'materials_id_counter'

export function getMaterials(): Material[] {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export function saveMaterials(items: Material[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getNextId(): number {
  const current = localStorage.getItem(KEY_ID)
  const next = current ? parseInt(current) + 1 : 0
  localStorage.setItem(KEY_ID, String(next))
  return next
}