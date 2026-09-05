import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("dukan_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("dukan_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item._id === product._id);
      if (found) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item._id !== id));

  const changeQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((current) =>
      current.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);