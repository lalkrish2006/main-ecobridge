import React from 'react';

function Events () {
  return (
    <div className="my-5">
      <div className="container py-5 px-4 rounded-4" style={{ backgroundColor: '#f0f2f5' }}>
        <h2 className="text-center mb-5 fw-bold">🔍 How EcoBridge Works</h2>
        <div className="row justify-content-center">

          <div className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">🌱 Explore Solutions</h5>
                <p className="card-text">
                  Discover sustainable development projects shared by changemakers around the world.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">📤 Share Your Work</h5>
                <p className="card-text">
                  Upload your project, innovation, or SDG solution for the global community to explore.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">🤝 Find Collaborators</h5>
                <p className="card-text">
                  Get matched with like-minded partners, organizations, or experts aligned with your mission.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">📊 Track Your Impact</h5>
                <p className="card-text">
                  Visualize the impact of your initiatives using EcoBridge’s Green Score and live analytics.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Events;
