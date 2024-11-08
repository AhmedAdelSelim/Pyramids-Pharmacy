import { memo } from 'react';

const MedicationList = memo(({ medications, onRequestRefill }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medications.map((medication) => (
        <div key={medication.id} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">{medication.name}</h3>
          <p className="text-gray-600 mb-4">{medication.description}</p>
          <p className="text-sm text-gray-500 mb-4">Dosage: {medication.dosage}</p>
          <button
            onClick={() => onRequestRefill(medication.id)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Request Refill
          </button>
        </div>
      ))}
    </div>
  );
});

export default MedicationList; 