import React, { useState, useEffect } from "react";
import "./Collabs.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PieActiveArc from "./PieActiveArc";

function Collabs() {
  const [myCollabs, setMyCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authRes = await axios.get("http://localhost:3002/isAuthenticated", {
          withCredentials: true,
        });

        if (!authRes.data.isAuthenticated) {
          navigate("/login");
          return;
        }

        const collabRes = await axios.get("http://localhost:3002/user/collabs", {
          withCredentials: true,
        });

        setMyCollabs(collabRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user collaborations:", err);
        navigate("/login");
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  // ➕ Calculate average impacts across collaborations
  const impactSummary = myCollabs.reduce(
    (acc, collab) => {
      acc.environmental += collab.environmentalImpact || 0;
      acc.social += collab.socialImpact || 0;
      acc.economic += collab.economicImpact || 0;
      return acc;
    },
    { environmental: 0, social: 0, economic: 0 }
  );

  const total = myCollabs.length || 1; // Avoid divide-by-zero

  const chartData = [
    { name: "Environmental", value: impactSummary.environmental / total },
    { name: "Social", value: impactSummary.social / total },
    { name: "Economic", value: impactSummary.economic / total },
  ];

  if (isLoading) return <div className="text-center mt-5">Loading your collaborations...</div>;

  return (
    <div className="collab-wrapper">
      <div className="collab-content p-4">
        <h2 className="mb-4">
          My Collaborations &nbsp;
          <Link to={`/collabs/create`} className="btn btn-link text-decoration-none">
            <i className="fa fa-plus" aria-hidden="true"></i> Create
          </Link>
          <Link to={`/joinForm`} className="btn btn-link text-decoration-none">
            <i className="fa fa-plus" aria-hidden="true"></i> Join
          </Link>
        </h2>

        <div className="row">
          {myCollabs.length === 0 ? (
            <div className="text-center text-muted mt-4">
              You are not part of any collaborations yet.
            </div>
          ) : (
            myCollabs.map((proj) => (
              <div className="col-md-6 mb-4" key={proj._id}>
                <div className="card shadow-sm card-hover h-100">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{proj.title}</h5>
                      <p className="card-text">{proj.description}</p>
                    </div>
                    <Link to={`/collabs/${proj._id}`} className="btn btn-sdg mt-2 align-self-start">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right fixed chart */}
      <div className="collab-chart d-none d-md-flex">
        <div className="chart-container">
          <h3 className="chart-title">Collaboration Impact Overview</h3>
          <PieActiveArc data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Collabs;
