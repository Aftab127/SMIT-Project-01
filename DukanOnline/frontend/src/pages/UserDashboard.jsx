import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const categories = {
  "Fashion & Apparel": ["Men", "Women", "Kids"],
  Electronics: ["Mobiles", "Kitchen", "Accessories"],
  "Home & Living": ["Furniture", "Decor", "Kitchen"],
  "Sports & Fitness": ["Gym Equipment", "Sport Wear"],
  Other: ["Gift", "Pets", "Digital"],
};

const blankProduct = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Fashion & Apparel",
  subcategory: "Men",
  stock: 10,
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(blankProduct);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get("/orders/my"),
        api.get("/products"),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setForm((current) => ({
        ...current,
        category: value,
        subcategory: categories[value][0],
      }));
      return;
    }
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const data = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editId) {
        await api.put(`/products/${editId}`, data);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", data);
        setMessage("Product added successfully.");
      }

      setForm(blankProduct);
      setEditId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image,
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Remove this product?")) return;

    setMessage("");
    setError("");
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product removed successfully.");
      if (editId === id) {
        setEditId(null);
        setForm(blankProduct);
      }
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove product.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(blankProduct);
    setMessage("");
    setError("");
  };

  return (
    <main className="container page">
      <section className="dashboard-head dashboard-banner">
        <div>
          <p className="eyebrow">MY ACCOUNT</p>
          <h1>Welcome, {user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="dashboard-badge">DukanOnline</div>
      </section>

      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}

      <section className="panel manage-products">
        <div className="section-heading product-manager-heading">
          <div>
            <p className="eyebrow">PRODUCT MANAGEMENT</p>
            <h2>{editId ? "Update Product" : "Add Products"}</h2>
            <p className="muted">
              Add new products or update and remove products from your store.
            </p>
          </div>
          <span className="product-count">{products.length} Products</span>
        </div>

        <form className="product-form" onSubmit={saveProduct}>
          <input
            name="name"
            placeholder="Product name"
            required
            value={form.name}
            onChange={change}
          />
          <input
            name="image"
            placeholder="Image URL"
            required
            value={form.image}
            onChange={change}
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            required
            value={form.price}
            onChange={change}
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            required
            value={form.stock}
            onChange={change}
          />
          <select name="category" value={form.category} onChange={change}>
            {Object.keys(categories).map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <select
            name="subcategory"
            value={form.subcategory}
            onChange={change}
          >
            {categories[form.category].map((subcategory) => (
              <option key={subcategory}>{subcategory}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={change}
          />
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId
                  ? "Update Product"
                  : "Add Product"}
            </button>
            {editId && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel product-management-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR STORE</p>
            <h2>Manage Products</h2>
          </div>
        </div>

        {!products.length ? (
          <div className="empty">No products available yet. Add your first product above.</div>
        ) : (
          <div className="manage-product-grid">
            {products.map((product) => (
              <article className="manage-product-card" key={product._id}>
                <img src={product.image} alt={product.name} />
                <div className="manage-product-body">
                  <span className="badge">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="muted">{product.subcategory}</p>
                  <div className="manage-product-meta">
                    <strong>Rs. {Number(product.price).toLocaleString()}</strong>
                    <span>Stock: {product.stock}</span>
                  </div>
                  <div className="manage-actions">
                    <button type="button" onClick={() => editProduct(product)}>
                      Update
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ORDER HISTORY</p>
            <h2>My Orders</h2>
          </div>
        </div>
        {!orders.length ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div>
                  <strong>Order #{order._id.slice(-8)}</strong>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="badge">{order.status}</span>
                <strong>Rs. {Number(order.total).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
