import axios from 'axios';
import { Participation } from '@/types/participation';

const API_URL = 'http://localhost:8081/api/participations';

export const getAllParticipations = async (): Promise<Participation[]> => {
  const response = await axios.get<Participation[]>(API_URL);
  return response.data;
};

export const getParticipationById = async (id: number): Promise<Participation> => {
  const response = await axios.get<Participation>(`${API_URL}/${id}`);
  return response.data;
};

export const createParticipation = async (
  participation: Omit<Participation, 'id'>
): Promise<Participation> => {
  const response = await axios.post<Participation>(API_URL, participation);
  return response.data;
};

export const updateParticipation = async (
  participation: Participation
): Promise<Participation> => {
  const response = await axios.put<Participation>(
    `${API_URL}/${participation.id}`,
    participation
  );
  return response.data;
};

export const deleteParticipation = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};