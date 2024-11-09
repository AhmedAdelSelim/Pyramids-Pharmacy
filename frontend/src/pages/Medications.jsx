import { useState, useEffect } from 'react';
import medicationsService from '../services/medications.service';
import MedicationCard from '../components/medications/MedicationCard';

export default function Medications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const data = await medicationsService.getAllMedications();
      setMedications(data);
    } catch (err) {
      setError('Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const handleRefillRequest = async (medicationId) => {
    try {
      await medicationsService.requestRefill(medicationId);
      alert('Refill request submitted successfully');
    } catch (err) {
      alert('Failed to submit refill request');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Medications
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View and request refills for your medications
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onRequestRefill={handleRefillRequest}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 