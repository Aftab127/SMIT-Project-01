import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, changeQuantity, total } = useCart();

  return (
    <main className="container page">
      <div className="section-heading">
        <div><p className="eyebrow">YOUR CART</p><h1>Shopping Cart</h1></div>
      </div>

      {!cart.length ? (
        <div className="empty">Your cart is empty. <Link to="/">Continue shopping</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>Rs. {Number(item.price).toLocaleString()}</p>
                  <input type="number" min="1" value={item.quantity}
                    onChange={(e) => changeQuantity(item._id, Number(e.target.value))} />
                </div>
                <button className="danger" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h2>Summary</h2>
            <p>Total: <strong>Rs. {total.toLocaleString()}</strong></p>
            <Link className="button" to="/checkout">Place Order</Link>
          </aside>
        </div>
      )}
    </main>
  );
}