import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import ManageProducts from "./pages/ManageProducts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FirebaseService";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(localStorage.getItem("isGuest") === "true");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsGuest(false);
        localStorage.removeItem("isGuest");
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <Router basename="/">
      <MainContent 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        isAuthenticated={isAuthenticated} 
        isGuest={isGuest} 
        setIsGuest={setIsGuest} 
      />
    </Router>
  );
}

const MainContent = ({ searchQuery, setSearchQuery, isAuthenticated, isGuest, setIsGuest }) => {
  const location = useLocation();

  // Hide navbar on login-related pages
  const shouldShowNavbar = !["/", "/login"].includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && (
        <NavBar 
          onSearch={setSearchQuery} 
          isAuthenticated={isAuthenticated} 
          isGuest={isGuest} 
        />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsGuest={setIsGuest} />} />
        <Route path="/home" element={<Home searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route 
          path="/products" 
          element={isAuthenticated ? <ManageProducts /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  );
};

export default App;