import axios from 'axios';
import { Member } from '@/types/member';

const API_URL = 'http://localhost:8081/api/members';

export const getAllMembers = async (): Promise<Member[]> => {
  const response = await axios.get<Member[]>(API_URL);
  return response.data;
};

export const getMemberById = async (id: number): Promise<Member> => {
  const response = await axios.get<Member>(`${API_URL}/${id}`);
  return response.data;
};

export const createMember = async (member: Omit<Member, 'id'>): Promise<Member> => {
  const response = await axios.post<Member>(API_URL, member);
  return response.data;
};

export const updateMember = async (member: Member): Promise<Member> => {
  const response = await axios.put<Member>(`${API_URL}/${member.id}`, member);
  return response.data;
};

export const deleteMember = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};