import api from './axios';
import { Member } from '@/types/member';

export const getMembers = async (): Promise<Member[]> => {
  const res = await api.get('/members');
  return res.data;
};

export const createMember = async (data: Omit<Member, 'id'>): Promise<Member> => {
  const res = await api.post('/members', data);
  return res.data;
};

export const updateMember = async (data: Member): Promise<Member> => {
  const res = await api.put(`/members/${data.id}`, data);
  return res.data;
};

export const deleteMember = async (id: number): Promise<void> => {
  await api.delete(`/members/${id}`);
};