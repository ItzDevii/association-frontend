import axios from 'axios';
import { AuditLog } from '@/types/auditlog';

const API_URL = 'http://localhost:8081/api/audit-logs';

export const getAllAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await axios.get<AuditLog[]>(API_URL);
  return response.data;
};

export const getAuditLogById = async (id: number): Promise<AuditLog> => {
  const response = await axios.get<AuditLog>(`${API_URL}/${id}`);
  return response.data;
};

export const createAuditLog = async (
  auditLog: Omit<AuditLog, 'id'>
): Promise<AuditLog> => {
  const response = await axios.post<AuditLog>(API_URL, auditLog);
  return response.data;
};

export const deleteAuditLog = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};