import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ReviewComponent = ({ collaborationId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3002/reviews/${collaborationId}`, {
        withCredentials: true,
      });
      setReviews(res.data);
    } catch (err) {
      setError('Failed to load reviews.');
    }
  }, [collaborationId]);

  useEffect(() => {
    fetchReviews();
  }, [collaborationId, fetchReviews]); // Added fetchReviews to the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    try {
      await axios.post(
        'http://localhost:3002/reviews',
        {
          collaborationId,
          userId,
          rating,
          review: comment,
        },
        { withCredentials: true }
      );
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:3002/reviews/${reviewId}`, {
        withCredentials: true,
      });
      fetchReviews();
    } catch (err) {
      setError('Failed to delete review.');
    }
  };

  return (
    <div className="mt-5">
      <h5>Leave a Review</h5>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '1.5rem',
              color: rating >= star ? '#ffc107' : '#e4e5e9',
              cursor: 'pointer',
            }}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className="form-control mb-2"
        rows={2}
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleSubmit}>
        Submit Review
      </button>

      <div className="mt-4">
        <h6>Reviews:</h6>
        {reviews.length === 0 ? (
          <p className="text-muted">No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="border rounded p-2 mb-2">
              <div>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < rev.rating ? '#ffc107' : '#e4e5e9',
                      fontSize: '1.2rem',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-1">{rev.review}</p>
              <small className="text-muted">By @{rev.userId?.username || 'Anonymous'}</small>
              {rev.userId?._id === userId && (
                <button
                  className="btn btn-sm btn-outline-danger float-end"
                  onClick={() => handleDelete(rev._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
