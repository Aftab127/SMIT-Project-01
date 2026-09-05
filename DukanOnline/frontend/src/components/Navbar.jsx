import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="navbar">
      <Link className="brand" to="/">DukanOnline</Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        {user && <Link to="/chat">Chat</Link>}

        {user ? (
          <>
            <Link to="/user">Dashboard</Link>
            <button className="link-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
