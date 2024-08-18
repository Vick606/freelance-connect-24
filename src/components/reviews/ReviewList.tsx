import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Review {
  id: string;
  content: string;
  rating: number;
  reviewerId: string;
  revieweeId: string;
  createdAt: string;
}

interface ReviewListProps {
  projectId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ projectId }) => {
  const { data: reviews, isLoading, error } = useQuery<Review[]>(
    ['reviews', projectId],
    () => axios.get(`/api/reviews?projectId=${projectId}`).then((res) => res.data)
  );

  if (isLoading) return <div className="text-center">Loading reviews...</div>;
  if (error) return <div className="text-center text-red-500">Error loading reviews</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border-b py-4">
            <div className="flex items-center mb-2">
              <span className="font-bold mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700">{review.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Submitted on: {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewList;