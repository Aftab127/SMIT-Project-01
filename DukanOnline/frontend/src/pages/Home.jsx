import { useEffect, useState } from "react";
import api from "../api/api";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "Fashion & Apparel",
  "Electronics",
  "Home & Living",
  "Sports & Fitness",
  "Other"
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === "All"
    ? products
    : products.filter((p) => p.category === category);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">WELCOME TO</p>
          <h1>DukanOnline</h1>
          <p>Fashion, electronics, home, sports and more — all in one online store.</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
          alt="DukanOnline shopping store"
        />
      </section>

      <section className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SHOP</p>
            <h2>Products</h2>
          </div>
          <div className="filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length ? (
          <div className="product-grid">
            {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="empty">No products found yet. Add products from your dashboard.</div>
        )}
      </section>
    </main>
  );
}