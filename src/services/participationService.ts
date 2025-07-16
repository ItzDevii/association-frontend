import api from './axios';
import { Participation } from '@/types/participation';

export const getParticipations = async (): Promise<Participation[]> => {
  const res = await api.get('/participations');
  return res.data;
};

export const createParticipation = async (data: Omit<Participation, 'id'>): Promise<Participation> => {
  const res = await api.post('/participations', data);
  return res.data;
};

export const updateParticipation = async (data: Participation): Promise<Participation> => {
  const res = await api.put(`/participations/${data.id}`, data);
  return res.data;
};

export const deleteParticipation = async (id: number): Promise<void> => {
  await api.delete(`/participations/${id}`);
};