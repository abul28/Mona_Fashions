// src/components/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, X, Heart, Icon } from "lucide-react";
// import { collection, getDocs } from "@firebase/firestore";
import { firestore } from "../firebase/FirebaseService";
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";

const Home = ({ searchQuery = "", onSearch }, ) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const whatsappGroupLink = "https://chat.whatsapp.com/BBkmScIBR1y0fZbLiP2WsI";

  const handlePurchaseClick = () => {
    if (whatsappGroupLink) {
      window.open(whatsappGroupLink, "_blank");
    } else {
      alert("WhatsApp group link is not set.");
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="clothes-container">
      {/* Search Bar */}
      <div className="mobile-search-bar">
          <input
            type="text"
            placeholder="Search products by title, category..."
            onChange={(e) => onSearch(e.target.value)} // Update search query
          />
          <button>
            <Search style={{ marginRight: "5px" }} />
          </button>
        </div>
      <h2 className="section-title">Explore Our Collection</h2>
      <div className="card-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item.id} className="clothing-card" onClick={() => handleCardClick(item.id)}>
              <div className="flex">
                <img src={item.imageUrl} alt={item.name} className="card-image" />
                {/* Wishlist Icons */}
                <Heart className="icon wishlist-icon" title="Wishlist" />
              </div>
              <div className="card-info">
                <h3 className="product-name">{item.name}</h3>
                {/* <p className="product-description">{item.description}</p>
                <p className="color-info">Color: {item.color}</p> */}
                <div className="price-info">
                  <span className="current-price">₹{item.price}</span>
                  <span className="original-price">₹{item.originalPrice}</span>
                  <span className="discount">{item.discount}% off</span>
                  <button className="purchase-button" onClick={handlePurchaseClick}>
                    Order Now
                  </button>
                </div>
                <span className="free-delivery">🚚 Free Delivery</span>
              </div>
            </div>
          ))
        ) : (
          <div className="search-filter-alert">
            <p>No products found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
