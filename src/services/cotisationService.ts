import { Cotisation } from '@/types/cotisation';
import api from './axios';

export const getCotisations = async (): Promise<Cotisation[]> => {
  const res = await api.get('/cotisations');
  return res.data;
};

export const createCotisation = async (data: Cotisation): Promise<Cotisation> => {
  const res = await api.post('/cotisations', data);
  return res.data;
};

export const updateCotisation = async (id: number, data: Cotisation): Promise<Cotisation> => {
  const res = await api.put(`/cotisations/${id}`, data);
  return res.data;
};

export const deleteCotisation = async (id: number): Promise<void> => {
  await api.delete(`/cotisations/${id}`);
};