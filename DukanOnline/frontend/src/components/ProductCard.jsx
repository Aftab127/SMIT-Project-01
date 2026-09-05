import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-body">
        <span className="badge">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="muted">{product.subcategory}</p>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>Rs. {Number(product.price).toLocaleString()}</strong>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}