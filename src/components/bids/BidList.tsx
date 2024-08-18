import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Bid {
  id: string;
  amount: number;
  proposal: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

interface BidListProps {
  projectId: string;
}

const BidList: React.FC<BidListProps> = ({ projectId }) => {
  const { data: bids, isLoading, error } = useQuery<Bid[]>(
    ['bids', projectId],
    () => axios.get(`/api/projects/${projectId}/bids`).then((res) => res.data)
  );

  if (isLoading) return <div className="text-center">Loading bids...</div>;
  if (error) return <div className="text-center text-red-500">Error loading bids</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Bids</h2>
      {bids && bids.length > 0 ? (
        bids.map((bid) => (
          <div key={bid.id} className="border-b py-4">
            <p className="font-bold">Amount: ${bid.amount.toFixed(2)}</p>
            <p className="text-gray-700">Proposal: {bid.proposal}</p>
            <p className="text-sm text-gray-500">
              Status: {bid.status.charAt(0).toUpperCase() + bid.status.slice(1).toLowerCase()}
            </p>
            <p className="text-sm text-gray-500">
              Submitted on: {new Date(bid.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No bids yet.</p>
      )}
    </div>
  );
};

export default BidList;