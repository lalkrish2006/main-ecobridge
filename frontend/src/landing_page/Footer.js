import React from 'react';
import '../Footer.css';
function Footer() {
  return (
    <footer className="bg-light text-center footer text-lg-start mt-2  shadow-sm">
      <div className="container p-4">
        <div className="row align-items-center">

          <div className="col-md-6 text-md-start mb-3 mb-md-0">
            <h5 className="fw-bold">EcoBridge</h5>
            <p className="mb-0">Connecting Changemakers for a Sustainable Future 🌍</p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-1 fw-semibold">Follow us:</p>
            <a href="https://facebook.com" className="social-icon me-3" aria-label="Facebook">
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a href="https://instagram.com" className="social-icon me-3" aria-label="Instagram">
              <i className="fab fa-instagram fa-lg"></i>
            </a>
            <a href="https://linkedin.com" className="social-icon me-3" aria-label="LinkedIn">
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
            <a href="https://twitter.com" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter fa-lg"></i>
            </a>
          </div>

        </div>
      </div>
      <div className="bg-dark text-white text-center py-2">
        © {new Date().getFullYear()} EcoBridge. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
