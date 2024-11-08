import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

export default function Medications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await axiosInstance.get('/medications/');
      setMedications(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch medications');
      setLoading(false);
    }
  };

  const requestRefill = async (medicationId) => {
    try {
      await axiosInstance.post('/refill-requests/', {
        medication: medicationId
      });
      alert('Refill request submitted successfully');
    } catch (error) {
      console.error('Error submitting refill request:', error);
      alert('Failed to submit refill request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Medications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((medication) => (
          <div key={medication.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-2">{medication.name}</h3>
            <p className="text-gray-600 mb-4">{medication.description}</p>
            <p className="text-sm text-gray-500 mb-4">Dosage: {medication.dosage}</p>
            <button
              onClick={() => requestRefill(medication.id)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Request Refill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 