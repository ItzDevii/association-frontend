import axios from 'axios';
import { Document } from '@/types/document';

const API_URL = 'http://localhost:8081/api/documents';

export const getAllDocuments = async (): Promise<Document[]> => {
  const response = await axios.get<Document[]>(API_URL);
  return response.data;
};

export const getDocumentById = async (id: number): Promise<Document> => {
  const response = await axios.get<Document>(`${API_URL}/${id}`);
  return response.data;
};

export const createDocument = async (document: Omit<Document, 'id'>): Promise<Document> => {
  const response = await axios.post<Document>(API_URL, document);
  return response.data;
};

export const updateDocument = async (document: Document): Promise<Document> => {
  const response = await axios.put<Document>(`${API_URL}/${document.id}`, document);
  return response.data;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};