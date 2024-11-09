import axiosInstance from '../utils/axios';

class MedicationsService {
  async getAllMedications() {
    const response = await axiosInstance.get('medications/');
    return response.data;
  }

  async requestRefill(medicationId, amount = 1) {
    const response = await axiosInstance.post('refill-requests/', {
      medication: medicationId,
      amount: amount
    });
    return response.data;
  }

  async getRefillHistory() {
    const response = await axiosInstance.get('refill-requests/history/');
    return response.data;
  }

  async getRefillStatus(refillId) {
    const response = await axiosInstance.get(`refill-requests/${refillId}/`);
    return response.data;
  }
}

export default new MedicationsService(); 