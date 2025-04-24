import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import socket from "./socket";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ReviewComponent from "./ReviewComponent";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CollabDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [collab, setCollab] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(true);
  const [barData, setBarData] = useState(null);
  const [greenScore, setGreenScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3002/isAuthenticated", { withCredentials: true })
      .then((res) => {
        if (!res.data.isAuthenticated) navigate("/login");
        else {
          setIsAuthenticated(true);
          setUser(res.data.user);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      axios
        .get(`http://localhost:3002/user/collabs/${id}`, { withCredentials: true })
        .then((res) => {
          setCollab(res.data);
          const ctx = document.createElement("canvas").getContext("2d");
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.6)");
          gradient.addColorStop(1, "rgba(153, 102, 255, 0.6)");
          setBarData({
            labels: ["Environmental", "Social", "Economic"],
            datasets: [
              {
                label: "Impact Score",
                data: [
                  Math.min(res.data.environmentalImpact || 0, 10),
                  Math.min(res.data.socialImpact || 0, 10),
                  Math.min(res.data.economicImpact || 0, 10),
                ],
                backgroundColor: gradient,
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
            ],
          });
        });
    }
  }, [isAuthenticated, user, id]);

  useEffect(() => {
    if (isAuthenticated && collab) {
      socket.emit("joinRoom", id);
      socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
      socket.on("chatHistory", (history) => {
        setMessages(history);
        setLoadingChat(false);
      });
      return () => {
        socket.off("chatMessage");
        socket.off("chatHistory");
      };
    }
  }, [isAuthenticated, collab, id]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      sender: user,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      roomId: id,
    };
    socket.emit("chatMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  if (!isAuthenticated) return <div>Checking authentication...</div>;
  if (!collab) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-md-8">
          <h2>{collab.title}</h2>
          <p>{collab.description}</p>
          <h5>Team Members:</h5>
          <ul>{collab.members?.map((m, i) => <li key={i}>{m.username}</li>)}</ul>

          <h5>SDGs:</h5>
          {collab.sdgs?.map((sdg, i) => (
            <span key={i} className="badge bg-primary me-2">{sdg}</span>
          ))}

          <h5 className="mt-4">Impact Overview:</h5>
          <div style={{ maxWidth: "500px" }}>
            {barData ? <Bar data={barData} options={{ scales: { y: { beginAtZero: true, max: 10 } } }} /> : <p>Loading chart...</p>}
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-outline-success" onClick={() => {
              setGreenScore(collab.greenScore || "N/A");
              setShowScore(true);
            }}>
              Predict Green Score
            </button>
            {showScore && <div className="alert alert-success mt-2 fw-bold fs-5">🌱 Green Score: {greenScore}</div>}
          </div>

          {/* Review Section */}
          {user && <ReviewComponent collaborationId={id} userId={user._id} />}

          <Link to="/collabs" className="btn btn-secondary mt-4">Back</Link>
        </div>

        {/* RIGHT SIDE: CHAT */}
        <div className="col-md-4 d-flex justify-content-center">
          <div className="card" style={{ width: "100%", maxWidth: "400px", position: "fixed", top: "200px" }}>
            <div className="card-header bg-success text-white">Group Chat</div>
            <div className="card-body" style={{ overflowY: "scroll", maxHeight: "300px", height: "300px" }}>
              {loadingChat ? (
                <div className="text-center">Loading chat...</div>
              ) : messages.length === 0 ? (
                <p className="text-muted">No messages yet.</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>
                      {msg.sender.username === user.username ? "You" : msg.sender.username}:
                    </strong>{" "}
                    {msg.content}
                    <div className="text-muted" style={{ fontSize: "0.8em" }}>
                      {msg.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="card-footer d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="btn btn-primary" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollabDetails;
