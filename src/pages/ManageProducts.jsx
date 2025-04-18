// src/components/ManageProducts.js
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/FirebaseService";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import "./ManageProducts.css";

const imgbbAPIKey = "23116f943c41b078861c20e46f8b67d8";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    color: "",
    originalPrice: "",
    discount: "",
    price: "",
    imageUrl: "",
    sizes: [],
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const availableSizes = ["M", "L", "XL", "XXL"];

  const fetchProducts = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(firestore, "products"));
    const productsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsArray);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const { originalPrice, discount } = newProduct;
    if (originalPrice && discount) {
      const discountAmount = (originalPrice * discount) / 100;
      const discountedPrice = originalPrice - discountAmount;
      setNewProduct((prev) => ({
        ...prev,
        price: discountedPrice.toFixed(2),
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, price: "" }));
    }
  }, [newProduct.originalPrice, newProduct.discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSizeChange = (size) => {
    setNewProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImagesUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImagesToImgBB = async (files) => {
    const urls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        urls.push(data.data.url);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    return urls;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = (await uploadImagesToImgBB([imageFile]))[0];
      }

      await addDoc(collection(firestore, "products"), {
        ...newProduct,
        imageUrl,
      });

      setNewProduct({
        name: "",
        description: "",
        color: "",
        originalPrice: "",
        discount: "",
        price: "",
        imageUrl: "",
        sizes: [],
      });
      setImageFile(null);
      setImagePreview("");
      alert("Product added successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setImagePreview(product.imageUrl);
    setIsEditing(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      let updatedImageUrl = newProduct.imageUrl;

      if (imageFile) {
        updatedImageUrl = (await uploadImagesToImgBB([imageFile]))[0];
      }

      const productRef = doc(firestore, "products", newProduct.id);
      await updateDoc(productRef, {
        ...newProduct,
        imageUrl: updatedImageUrl,
      });

      setIsEditing(false);
      setNewProduct({
        name: "",
        description: "",
        color: "",
        originalPrice: "",
        discount: "",
        price: "",
        imageUrl: "",
        sizes: [],
      });
      setImageFile(null);
      setImagePreview("");
      alert("Product updated successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(firestore, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-management-container">
      <h2>Manage Products</h2>
      <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={newProduct.color}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="originalPrice"
          placeholder="Original Price"
          value={newProduct.originalPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={newProduct.discount}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          readOnly
        />

        {/* Size selection */}
        <div className="size-selection">
          {availableSizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                value={size}
                checked={newProduct.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          ))}
        </div>

        <input type="file" onChange={handleImagesUpload} />
        {imagePreview && (
          <img src={imagePreview} alt="Product Preview" className="preview" required />
        )}

        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>

      {/* Display Products in Grid */}
      <div className="product-grid">
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <p className="product-text">{product.name}</p>
              <p className="product-text">Price: ₹{product.price}</p>
              <div className="product-actions">
                <button className="edit" onClick={() => handleEditProduct(product)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
