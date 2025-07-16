import api from './axios';
import { Cotisation } from '@/types/cotisation';

export const getCotisations = async (): Promise<Cotisation[]> => {
  const res = await api.get('/cotisations');
  return res.data;
};

export const createCotisation = async (data: Omit<Cotisation, 'id'>): Promise<Cotisation> => {
  const res = await api.post('/cotisations', data);
  return res.data;
};

export const updateCotisation = async (data: Cotisation): Promise<Cotisation> => {
  const res = await api.put(`/cotisations/${data.id}`, data);
  return res.data;
};

export const deleteCotisation = async (id: number): Promise<void> => {
  await api.delete(`/cotisations/${id}`);
};