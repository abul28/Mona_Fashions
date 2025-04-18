import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase/FirebaseService";
import { doc, getDoc } from "firebase/firestore";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M"); // Default size is 'M'
  const [availableSizes, setAvailableSizes] = useState([]); // Store fetched sizes

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(firestore, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct(productData);
          setAvailableSizes(productData.sizes || []); // Fetch available sizes
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading product details...</h2>;
  }

  const whatsappGroupLink = "https://chat.whatsapp.com/BBkmScIBR1y0fZbLiP2WsI";

  const handlePurchaseClick = () => {
    if (whatsappGroupLink) {
      window.open(whatsappGroupLink, "_blank");
    } else {
      alert("WhatsApp group link is not set.");
    }
  };

  return (
    <div className="product-details-container">
      {/* Product Image */}
      <div className="image-container">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>

      {/* Size Selection */}
      <div className="size-selection">
        <label>Select Size:</label>
        <div className="size-options">
          {["M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              className={`size-button ${selectedSize === size ? "selected" : ""}`}
              onClick={() => availableSizes.includes(size) && setSelectedSize(size)}
              disabled={!availableSizes.includes(size)} // Disable if size not available
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div className="price-section">
        <span className="current-price">₹{product.price}</span>
        <span className="original-price">₹{product.originalPrice}</span>
        <span className="discount">{product.discount}% off</span>
      </div>

      {/* Product Details */}
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-color">
          Color: <span>{product.color}</span>
        </p>
      </div>

      {/* Place Order Button */}
      <button className="place-order-btn" onClick={handlePurchaseClick}>
        Place Order
      </button>
    </div>
  );
};

export default ProductDetails;
