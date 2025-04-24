import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const projects = [
  {
    title: 'SolarVillage',
    description: 'Bringing clean solar power to remote rural communities, improving energy access and sustainability.',
    tags: ['SDG 7', 'SDG 13'],
    image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'Edu4All',
    description: 'An inclusive education platform that empowers children in underserved areas with digital learning.',
    tags: ['SDG 4', 'SDG 10'],
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=60'
  },
  {
    title: 'GreenWater',
    description: 'Low-cost community water filters to ensure safe and sustainable drinking water.',
    tags: ['SDG 6', 'SDG 3'],
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=60'
  }
];

export default function FeaturedProjects() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3002/isAuthenticated", {
          withCredentials: true,
        });
        setIsAuthenticated(res.data.isAuthenticated);
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-5">🌱 Featured Collaborations</h2>
      <div className="row">
        {projects.map((project, idx) => (
          <div className="col-md-4 mb-4" key={idx}>
            <div className="card h-100 shadow-sm card-hover">
              <img
                src={project.image}
                className="card-img-top"
                alt={project.title}
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{project.title}</h5>
                <p className="card-text" style={{ textAlign: 'justify' }}>
                  {project.description}
                </p>
                <div>
                  {project.tags.map((tag, i) => (
                    <span key={i} className="badge bg-primary me-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAuthenticated && (
        <div
          className="container text-center my-5 py-5"
          style={{ backgroundColor: '#f0f2f5', borderRadius: '12px' }}
        >
          <h2 className="mb-4 fw-bold">Ready to start collaborating?</h2>
          <p className="mb-4 fs-5">
            Join the EcoBridge community and contribute to global impact through the SDGs.
          </p>
          <div>
            <a
              href="/signup"
              className="btn mx-2"
              style={{
                backgroundColor: '#002d72',
                color: 'white',
                padding: '12px 28px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '50px',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#001f4d')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#002d72')}
            >
              Sign Up
            </a>

            <a
              href="/login"
              className="btn mx-2"
              style={{
                backgroundColor: 'transparent',
                color: '#002d72',
                padding: '12px 28px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '50px',
                border: '2px solid #002d72',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#002d72';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#002d72';
              }}
            >
              Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
