import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getShopProducts, createProduct, updateProduct, deleteProduct, addToCart, getCart } from '../lib/api.js';

const Dashboard = () => {
  const { user, admin } = useAuth();
  const isAdmin = admin !== null;
  const isUser = user !== null && !isAdmin;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', discount: '0', image: null });

  useEffect(() => {
    loadProducts();
    if (isUser) {
      loadCart();
    }
  }, [isUser]);

  const loadCart = async () => {
    try {
      const data = await getCart();
      if (data.success) {
        setCartItems(data.cartItems || []);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const isProductInCart = (productId) => {
    if (!cartItems || cartItems.length === 0) return false;
    return cartItems.some(
      (item) => {
        const itemId = item._id ? item._id.toString() : item.toString();
        return itemId === productId.toString();
      }
    );
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getShopProducts();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      if (editingProduct) {
        // Update existing product
        const data = await updateProduct(editingProduct._id, {
          name: form.name,
          price: parseFloat(form.price),
          discount: parseFloat(form.discount) || 0,
          image: form.image
        });

        if (data.success) {
          setSuccess('Product updated successfully!');
          setShowModal(false);
          setEditingProduct(null);
          setForm({ name: '', price: '', discount: '0', image: null });
          loadProducts();
        } else {
          setError(data.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const data = await createProduct({
          name: form.name,
          price: parseFloat(form.price),
          discount: parseFloat(form.discount) || 0,
          image: form.image
        });

        if (data.success) {
          setSuccess('Product created successfully!');
          setShowModal(false);
          setForm({ name: '', price: '', discount: '0', image: null });
          loadProducts();
        } else {
          setError(data.message || 'Failed to create product');
        }
      }
    } catch (err) {
      setError(err.message || `Failed to ${editingProduct ? 'update' : 'create'} product`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      discount: product.discount?.toString() || '0',
      image: null
    });
    setShowModal(true);
  };

  const handleAddToCart = async (productId) => {
    try {
      setError(null);
      setSuccess(null);
      const data = await addToCart(productId);
      if (data.success) {
        setSuccess('Product added to cart!');
        // Reload cart to update the button state
        await loadCart();
      } else {
        setError(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setError(null);
      setSuccess(null);
      const data = await deleteProduct(id);
      if (data.success) {
        setSuccess('Product deleted successfully!');
        loadProducts();
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({ name: '', price: '', discount: '0', image: null });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shop</h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back, {admin?.name || user?.name || 'Guest'}!
            {isAdmin && <span className="ml-2 text-purple-600">(Administrator)</span>}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">
            {isAdmin ? 'No products found. Create your first product!' : 'No products available.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const finalPrice = product.discount > 0
              ? product.price * (1 - product.discount / 100)
              : product.price;
            return (
              <div key={product._id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {product.imageBase64 && (
                      <img
                        src={`data:image/png;base64,${product.imageBase64}`}
                        alt={product.name}
                        className="mb-3 h-32 w-full rounded object-cover"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                    <div className="mt-2">
                      {product.discount > 0 && (
                        <p className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</p>
                      )}
                      <p className="text-lg font-bold text-blue-600">${finalPrice.toFixed(2)}</p>
                      {product.discount > 0 && (
                        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  {isUser && (
                    <button
                      disabled={isProductInCart(product._id)}
                      onClick={() => handleAddToCart(product._id)}
                      className={`w-full rounded-md px-3 py-2 text-sm font-medium text-white
      ${isProductInCart(product._id)
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {isProductInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                    </button>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                  Price *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={form.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-slate-700">
                  Discount (%)
                </label>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                  Image {editingProduct && <span className="text-xs text-slate-500">(Leave empty to keep current image)</span>}
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setForm({ name: '', price: '', discount: '0', image: null });
                  }}
                  className="flex-1 rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

