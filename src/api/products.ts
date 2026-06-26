import axios from 'axios'

const API = 'http://localhost:3001'

function headers() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}

export async function getProducts(search?: string) {
  const params = search ? { search } : {}
  const { data } = await axios.get(`${API}/products`, { headers: headers(), params })
  return data
}

export async function createProduct(product: object) {
  const { data } = await axios.post(`${API}/products`, product, { headers: headers() })
  return data
}

export async function updateProduct(id: number, product: object) {
  const { data } = await axios.put(`${API}/products/${id}`, product, { headers: headers() })
  return data
}

export async function deleteProduct(id: number) {
  await axios.delete(`${API}/products/${id}`, { headers: headers() })
}
