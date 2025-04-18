import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseService";
import "./Login.css"; // Import CSS for styling
// import logo from "/qcb-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isGuest", "false");
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  const handleContinueWithoutLogin = () => {
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("isAuthenticated", "false");
    navigate("/home");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        {/* Logo and Boutique Name */}
        {/* <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="boutique-name">Queens Court Boutique</h1> */}

        {/* Login Form */}
        <h4>Admin Login</h4>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}

        {/* Continue without Login */}
        <button onClick={handleContinueWithoutLogin}>Continue Without Login</button>
      </div>
    </div>
  );
};

export default Login;
