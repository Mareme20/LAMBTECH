import apiClient from '../api/client';
import type { Medicament, Pharmacie } from '../types';

export const MedicamentService = {
  findAll: async (): Promise<Medicament[]> => {
    const response = await apiClient.get<Medicament[]>('/medicaments');
    return response.data;
  },

  create: async (data: any): Promise<Medicament> => {
    const response = await apiClient.post<Medicament>('/medicaments', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<Medicament> => {
    const response = await apiClient.put<Medicament>(`/medicaments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/medicaments/${id}`);
  },

  searchNearby: async (lat: number, lon: number, radius: number = 10, query?: string): Promise<any[]> => {
    const response = await apiClient.get('/medicaments/nearby', {
      params: { lat, lon, radius, query },
    });
    return response.data;
  },

  searchPrescriptionNearby: async (lat: number, lon: number, meds: string[], radius: number = 10): Promise<any[]> => {
    const response = await apiClient.get('/medicaments/nearby-prescription', {
      params: { lat, lon, meds: meds.join(','), rayon: radius },
    });
    return response.data;
  },
};

export const CommandeService = {
  create: async (commandeData: any): Promise<any> => {
    const response = await apiClient.post('/commandes', commandeData);
    return response.data;
  },

  findAll: async (): Promise<any[]> => {
    const response = await apiClient.get('/commandes');
    return response.data;
  },

  findByUser: async (): Promise<any[]> => {
    const response = await apiClient.get('/commandes/user'); // Supposant que cette route existe ou on filtrera
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<void> => {
    await apiClient.put(`/commandes/${id}/status`, { status });
  },
};

export const StockService = {
  findAll: async (): Promise<any[]> => {
    const response = await apiClient.get('/stocks');
    return response.data;
  },

  create: async (data: any): Promise<any> => {
    const response = await apiClient.post('/stocks', data);
    return response.data;
  },

  updateQuantity: async (pharmacieId: number, medicamentId: number, quantite: number): Promise<void> => {
    await apiClient.put(`/stocks/${pharmacieId}/${medicamentId}`, { quantite });
  },
};

export const PharmacieService = {
  findAll: async (): Promise<Pharmacie[]> => {
    const response = await apiClient.get<Pharmacie[]>('/pharmacies');
    return response.data;
  },

  create: async (data: any): Promise<Pharmacie> => {
    const response = await apiClient.post<Pharmacie>('/pharmacies', data);
    return response.data;
  },

  findNearby: async (lat: number, lon: number): Promise<any[]> => {
    const response = await apiClient.get('/pharmacies/nearby', {
      params: { latitude: lat, longitude: lon },
    });
    return response.data;
  },
};

export const AIService = {
  scanPrescription: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('prescription', file);
    const response = await apiClient.post('/ai/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  chat: async (message: string): Promise<any> => {
    const response = await apiClient.post('/ai/chat', { message });
    return response.data;
  },

  getAlerts: async (): Promise<any> => {
    const response = await apiClient.get('/stats/alerts');
    return response.data;
  },
};
