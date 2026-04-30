export type HistoryItem = {
  id: number
  action: 'CREADO' | 'EDITADO' | 'BORRADO'
  material: string
  tipo: string
  ubicacion: string
  cantidad: number
  fecha: string
}

const KEY = 'history'
const KEY_ID = 'history_id'

export function getHistory(): HistoryItem[] {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function getNextHistoryId(): number {
  const current = localStorage.getItem(KEY_ID)
  const next = current ? parseInt(current) + 1 : 0
  localStorage.setItem(KEY_ID, String(next))
  return next
}


export function addHistory(item: Omit<HistoryItem, 'id'>) {
  const history = getHistory()

  const newItem: HistoryItem = {
    ...item,
    id: getNextHistoryId()
  }

  history.unshift(newItem)
  saveHistory(history)
}