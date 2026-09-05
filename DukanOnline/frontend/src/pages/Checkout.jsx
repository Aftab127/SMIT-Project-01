import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post("/orders", {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        total
      });
      clearCart();
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/user"), 700);
    } catch (err) {
      setMessage(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={placeOrder}>
        <p className="eyebrow">CHECKOUT</p>
        <h1>Place Your Order</h1>
        <p>Items: {cart.length}</p>
        <h2>Rs. {total.toLocaleString()}</h2>
        <input placeholder="Delivery address" required />
        <input placeholder="Phone number" required />
        <button type="submit">Confirm Order</button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}