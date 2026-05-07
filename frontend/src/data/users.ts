export type User = {
  id: number
  nombre: string
  email: string
  rol: string
  material: string
}

const KEY = 'users'
const KEY_ID = 'users_id'

export function getUsers(): User[] {
  const data = localStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]) {
  localStorage.setItem(KEY, JSON.stringify(users))
}

export function getNextUserId(): number {
  const id = localStorage.getItem(KEY_ID)
  const next = id ? parseInt(id) : 0
  localStorage.setItem(KEY_ID, String(next + 1))
  return next
}