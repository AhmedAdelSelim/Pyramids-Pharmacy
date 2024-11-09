import React, { useState } from 'react';
import medicationsService from '../../services/medications.service';

const MedicationCard = ({ medication }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(1);

  const formatDate = (dateString) => {
    if (!dateString) return 'No refills yet';
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return `(${date.toLocaleDateString('en-US', options)})`;
  };

  const handleRefillRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      await medicationsService.requestRefill(medication.id, amount);
      alert('Refill request submitted successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit refill request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transform transition-all duration-300 hover:scale-105">
      <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${medication.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {medication.available ? 'Available' : 'Out of Stock'}
          </span>
        </div>

        <div className="p-6">
          {/* Icon */}
          <div className="w-12 h-12 mb-4 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-indigo-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {medication.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {medication.description}
          </p>

          {/* Details */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              </svg>
              Dosage: {medication.dosage}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Last Refill: {medication.last_refill 
                ? formatDate(medication.last_refill.date)
                : 'No refills yet'
              }
            </div>
          </div>

          {/* Quantity Information */}
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" 
              />
            </svg>
            Available Quantity: {medication.quantity}
          </div>

          {/* Amount Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Refill Amount
            </label>
            <input
              type="number"
              min="1"
              max={medication.quantity}
              value={amount}
              onChange={(e) => setAmount(Math.min(Math.max(1, parseInt(e.target.value) || 1), medication.quantity))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Request Button */}
          <button
            onClick={handleRefillRequest}
            disabled={loading || !medication.available || medication.quantity < 1}
            className={`
              w-full mt-4 px-4 py-2 rounded-lg font-medium
              transition-all duration-300 transform
              ${!medication.available || medication.quantity < 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : loading
                  ? 'bg-indigo-400 cursor-wait'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]'
              }
            `}
          >
            {!medication.available 
              ? 'Out of Stock'
              : medication.quantity < 1
                ? 'No Stock Available'
                : loading 
                  ? 'Requesting...' 
                  : `Request Refill (${amount})`
            }
          </button>

          {error && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationCard; 
