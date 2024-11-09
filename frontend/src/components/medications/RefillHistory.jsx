import React, { useState, useEffect } from 'react';
import medicationsService from '../../services/medications.service';

const RefillHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await medicationsService.getRefillHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch refill history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Refill History</h3>
      <div className="space-y-4">
        {history.map((refill) => (
          <div 
            key={refill.id} 
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{refill.medication.name}</p>
                <p className="text-sm text-gray-500">
                  Requested: {new Date(refill.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`
                px-2 py-1 rounded-full text-sm
                ${refill.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  refill.status === 'DENIED' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}
              `}>
                {refill.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefillHistory; 