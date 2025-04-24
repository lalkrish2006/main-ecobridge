import React, { useState, useEffect } from "react";
import "../Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    axios
      .get("http://localhost:3002/isAuthenticated", { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(res.data.isAuthenticated);
      })
      .catch((err) => {
        console.error("Authentication check failed:", err);
      });
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post("http://localhost:3002/logout", {}, { withCredentials: true });
      setIsAuthenticated(false); // Update state to reflect logout
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow custom-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          EcoBridge
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 ms-auto mb-lg-0">
            <li className="nav-item me-3">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link" href="/collabs">
                My Collaborations
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link" href="/support">
                Support
              </a>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link" href="/signup">
                    Sign Up
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item me-3">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
