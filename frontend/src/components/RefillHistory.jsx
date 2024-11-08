import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RefillHistory() {
  const [refills, setRefills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefillHistory();
  }, []);

  const fetchRefillHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/refill-requests/');
      setRefills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch refill history:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Refill History</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {refills.map((refill) => (
            <li key={refill.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {refill.medication_name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        refill.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : refill.status === 'DENIED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {refill.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Requested on {new Date(refill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 