import api from './axios';
import { Document } from '@/types/document';

export const getDocuments = async (): Promise<Document[]> => {
  const res = await api.get('/documents');
  return res.data;
};

export const createDocument = async (data: Omit<Document, 'id'>): Promise<Document> => {
  const res = await api.post('/documents', data);
  return res.data;
};

export const updateDocument = async (data: Document): Promise<Document> => {
  const res = await api.put(`/documents/${data.id}`, data);
  return res.data;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/documents/${id}`);
};