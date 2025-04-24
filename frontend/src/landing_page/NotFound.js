import React from "react";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1 ">404</h1>
      <h2 className="mb-4">Oops! Page Not Found 😕</h2>
      <p className="mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-success rounded-pill">
        Go to Home
      </Link>
    </div>
  );
}

export default Notfound;
