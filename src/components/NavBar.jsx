import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, X, Heart } from "lucide-react";
import "./Navbar.css";
// import logo from "/qcb-logo.png";

const Navbar = ({ onSearch, setSearchQuery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const guestStatus = localStorage.getItem("isGuest");

    setIsAuthenticated(authStatus === "true");
    setIsGuest(guestStatus === "true");
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const goToPage = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isGuest");
    setIsAuthenticated(false);
    setIsGuest(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* <img src={logo} alt="Logo" className="logo_icon" /> */}
        <div className="logo">Mona Fashions</div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products by title, category..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <button>
            <Search style={{ marginRight: "5px" }} />
          </button>
        </div>

        <div className="actions">
          <Heart className="icon wishlist-icon" title="Wishlist" />
          <ShoppingCart className="icon" title="Cart" />
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X className="icon" /> : <Menu className="icon" />}
        </button>

        <ul className={`menu-items ${isOpen ? "show-menu" : ""}`}>
          <li onClick={() => goToPage("/home")}>Home</li>

          {/* Show Manage Products only if authenticated and not a guest */}
          {isAuthenticated && !isGuest && (
            <li onClick={() => goToPage("/products")}>Manage Products</li>
          )}

          <li onClick={() => goToPage("/contact")}>Contact</li>

          {/* Show Logout if authenticated or guest, otherwise show Login */}
          {(isAuthenticated || isGuest) ? (
            <li onClick={handleLogout}>Logout</li>
          ) : (
            <li onClick={() => goToPage("/login")}>Login</li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
