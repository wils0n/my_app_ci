import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct } from '../api/products'
import { logout } from '../api/auth'
import ProductModal from '../components/ProductModal'
import './Products.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts(search || undefined)
      setProducts(data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [search, navigate])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    fetchProducts()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    fetchProducts()
  }

  return (
    <div className="products-page">
      <header className="products-header">
        <h1>📦 Gestión de Productos</h1>
        <div className="header-right">
          <span>
            Hola, <strong>{username}</strong>
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="btn-primary" onClick={openCreate}>
          + Nuevo Producto
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="state-msg">Cargando...</div>
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="state-msg">
                      {search ? 'Sin resultados para tu búsqueda' : 'No hay productos. ¡Crea el primero!'}
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td className="td-id">{p.id}</td>
                      <td className="td-name">{p.name}</td>
                      <td className="td-desc">{p.description || <span className="empty-val">—</span>}</td>
                      <td className="td-price">${Number(p.price).toFixed(2)}</td>
                      <td className="td-stock">
                        <span className={`stock-badge ${p.stock === 0 ? 'out' : p.stock < 5 ? 'low' : 'ok'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn-edit" onClick={() => openEdit(p)}>
                            Editar
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(p.id)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {!loading && products.length > 0 && (
          <p className="table-count">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {modalOpen && <ProductModal product={editing} onClose={closeModal} />}
    </div>
  )
}
