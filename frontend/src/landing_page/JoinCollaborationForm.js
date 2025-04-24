import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Form.css';

const JoinCollaborationForm = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState('');
  const [message, setMessage] = useState('');

  // Fetch collaborations where the user is not a member
  useEffect(() => {
    axios
      .get('http://localhost:3002/collabs', { withCredentials: true })
      .then((res) => setCollaborations(res.data))
      .catch((err) => {
        console.error('Error fetching collaborations:', err);
        setMessage('Could not load collaborations.');
      });
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCollab) {
      setMessage('Please select a collaboration to join.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3002/collabs/join/${selectedCollab}`,
        {},
        { withCredentials: true }
      );

      setMessage(res.data.message || 'Successfully joined collaboration!');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to join collaboration.');
    }
  };

  return (
    <div className="container mt-5 mb-5 form">
      <h2 className="mb-4">Join a Collaboration</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Select Collaboration</label>
          <select
            className="form-select"
            value={selectedCollab}
            onChange={(e) => setSelectedCollab(e.target.value)}
            required
          >
            <option value="">-- Select a Collaboration --</option>
            {collaborations.map((collab) => (
              <option key={collab._id} value={collab._id}>
                {collab.title || 'Untitled Collaboration'}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Join Collaboration
        </button>
      </form>

      {message && (
        <div className="alert alert-info mt-3 text-center">{message}</div>
      )}
    </div>
  );
};

export default JoinCollaborationForm;
