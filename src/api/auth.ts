import axios from 'axios'

const API = 'http://localhost:3001'

export async function login(username: string, password: string) {
  const { data } = await axios.post(`${API}/auth/login`, { username, password })
  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}
