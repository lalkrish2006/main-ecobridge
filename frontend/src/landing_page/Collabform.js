import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CollabForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sdgs: '',
    members: '',
    environmentalImpact: 0,
    socialImpact: 0,
    economicImpact: 0,
  });

  const calculateGreenScore = (environmentalImpact, socialImpact, economicImpact) => {
    const MAX_ENVIRONMENTAL_IMPACT = 1000;
    const MAX_ECONOMIC_IMPACT = 1000000;

    const normalizedEnvironmentalImpact = (environmentalImpact / MAX_ENVIRONMENTAL_IMPACT) * 100;
    const normalizedSocialImpact = socialImpact * 10;
    const normalizedEconomicImpact = (economicImpact / MAX_ECONOMIC_IMPACT) * 100;

    return (
      (normalizedEnvironmentalImpact * 0.33) +
      (normalizedSocialImpact * 0.33) +
      (normalizedEconomicImpact * 0.33)
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const greenScore = calculateGreenScore(
      formData.environmentalImpact,
      formData.socialImpact,
      formData.economicImpact
    );

    const submissionData = {
      title: formData.title,
      description: formData.description,
      sdgs: formData.sdgs.split(',').map(s => s.trim()).filter(Boolean),
      environmentalImpact: formData.environmentalImpact,
      socialImpact: formData.socialImpact,
      economicImpact: formData.economicImpact,
      greenScore
    };

    if (formData.members.trim() !== '') {
      submissionData.members = formData.members.split(',').map(m => m.trim()).filter(Boolean);
    }

    try {
      await axios.post('http://localhost:3002/collabs/create', submissionData, {
        withCredentials: true
      });
      alert('Collaboration Created Successfully!');
      navigate('/collabs');
    } catch (err) {
      console.error('Error creating collab:', err.response?.data || err);
      alert(err.response?.data?.error || 'Error creating collaboration.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Collaboration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title:</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Description:</label>
          <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>SDGs (comma-separated):</label>
          <input type="text" name="sdgs" className="form-control" value={formData.sdgs} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Invite Members by Username (comma-separated):</label>
          <input type="text" name="members" className="form-control" value={formData.members} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Environmental Impact (1-10):</label>
          <input type="number" name="environmentalImpact" className="form-control" value={formData.environmentalImpact} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Social Impact (1-10):</label>
          <input type="number" name="socialImpact" className="form-control" min="1" max="10" value={formData.socialImpact} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Economic Impact (1-10):</label>
          <input type="number" name="economicImpact" className="form-control" value={formData.economicImpact} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Create Collaboration</button>
      </form>
    </div>
  );
}

export default CollabForm;