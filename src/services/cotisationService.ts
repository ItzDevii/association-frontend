import axios from 'axios';
import { Cotisation } from '@/types/cotisation';

const API_URL = 'http://localhost:8081/api/cotisations';

export const getAllCotisations = async (): Promise<Cotisation[]> => {
  const response = await axios.get<Cotisation[]>(API_URL);
  return response.data;
};

export const getCotisationById = async (id: number): Promise<Cotisation> => {
  const response = await axios.get<Cotisation>(`${API_URL}/${id}`);
  return response.data;
};

export const createCotisation = async (cotisation: Omit<Cotisation, 'id'>): Promise<Cotisation> => {
  const response = await axios.post<Cotisation>(API_URL, cotisation);
  return response.data;
};

export const updateCotisation = async (cotisation: Cotisation): Promise<Cotisation> => {
  const response = await axios.put<Cotisation>(`${API_URL}/${cotisation.id}`, cotisation);
  return response.data;
};

export const deleteCotisation = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};